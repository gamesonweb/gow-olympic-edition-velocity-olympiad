import {
    Engine,
    HDRCubeTexture,
    HemisphericLight,
    Material,
    Mesh,
    MeshBuilder,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShapeMesh,
    SceneLoader,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {OlympiadScene} from "../OlympiadScene";
import {Level1EnemyManager} from "./enemyManager";
import {Player, PlayerState} from "../../character/players";
import {FlammeCard} from "../../gameObjects/Card/armes/FlammeCard";
import {JumpCard} from "../../gameObjects/Card/armes/JumpCard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {CardSocle} from "../../gameObjects/Card/CardSocle";
import { Wall } from "../../gameObjects/Wall";
import { TempleTorch} from "../../gameObjects/TempleTorch";

export class Level1Scene extends OlympiadScene {
    protected readonly enemyManager: Level1EnemyManager;
    // noinspection JSUnusedGlobalSymbols
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];
    private _light?: HemisphericLight;

    constructor(engine: Engine, playerState: PlayerState) {

        super(engine);

        this.enemyManager = new Level1EnemyManager(this);
        this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

        this.player = new Player(playerState, this);

    }

    public async init(): Promise<void> {
        await super.init();
        this.player.init(new Vector3(0, 50, 0));
        this.enemyManager.init();
        await this._buildlevelStatic();
        this._createDynamic();
        this.addComponent(this.player);
        this.addGameObject(this.player);
    }

    public restart() {
        let newScene = new Level1Scene(this.getEngine(), this.player.playerState)
        newScene.init().then(() => {
            this.destroy()
        });
    }

    public onPauseState() {
        return
    }

    public onResumeState() {
        return
    }

    public destroy(): void {
        this._meshes.forEach((mesh) => mesh.dispose());
        this._materials.forEach((material) => material.dispose());
        this._light?.dispose();
        super.destroy();
    }

    private _buildlevelStatic(): void {
        SceneLoader.ImportMesh("", "models/", "Level1.glb", this, (meshes) => {
            const root = meshes[0];
            root.position = new Vector3(0, 0, 0);
            root.rotation = new Vector3(0, 0, 0);
            root.scaling = new Vector3(1, 1, 1);
            const childrens = root.getChildren();

            for (let child of childrens) {
                const mesh = child as Mesh;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this);
                body.shape = new PhysicsShapeMesh(mesh, this)
            }
            // new PhysicsAggregate(root, PhysicsShapeType.BOX, {mass: 0}, this);
        });

        //Adding a Skybox

        const skybox = MeshBuilder.CreateBox("skyBox", {size: 1024}, this);
        skybox.renderingGroupId = 0;
        const skyboxMaterial = new StandardMaterial("skyBox", this);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = new HDRCubeTexture("textures/skybox/skybox.hdr", this, 512);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;


    }

    private _createDynamic() {
        //Adding a light

        this._light = new HemisphericLight("light", new Vector3(0, 10, 0), this);

        //Adding Destructable Walls and Cards

        let Cards =[
            {card: new JumpCard(RareteCard.RARE), position: new Vector3(-11, 8.5, -33)},
            {card: new FlammeCard(RareteCard.RARE), position: new Vector3(-11, 8.5, -33)},
            {card: new FlammeCard(RareteCard.COMMON), position: new Vector3(-42, 10.5, -155)},
            {card: new FlammeCard(RareteCard.COMMON), position: new Vector3(20, 13.5, -305)},
            {card: new FlammeCard(RareteCard.RARE), position: new Vector3(45, 13.5, -387)},
            {card: new FlammeCard(RareteCard.RARE), position: new Vector3(188, 15.5, -716)},
            {card: new JumpCard(RareteCard.RARE), position: new Vector3(425, 19.5, -535)},
            {card: new JumpCard(RareteCard.EPIC), position: new Vector3(635, 53, -532)},
            {card: new FlammeCard(RareteCard.LEGENDARY), position: new Vector3(719, 53, -521)},
            {card: new FlammeCard(RareteCard.EPIC), position: new Vector3(1100, 58, -920)}
        ]

        let destructableWalls = [
            {wall : new Wall(this,new Vector3(-30, 10.5, -206), 120, 40, new Vector3(0, -Math.PI/5, 0))},
            {wall : new Wall(this,new Vector3(35, 12.5, -350), 160, 40, new Vector3(0, -Math.PI/5, 0))},
            {wall : new Wall(this,new Vector3(261, 15.5, -553), 150, 40, new Vector3(0, Math.PI/4, 0))},
            {wall : new Wall(this,new Vector3(972, 56, -697), 150, 40, new Vector3(0, Math.PI*5/6, 0))},
        ]

        let ennemyPositions = [
            new Vector3(126, 15, -492.4),
            new Vector3(80, 15, -522),
            new Vector3(816, 53.8, -522),
            new Vector3(873, 53.8, -553),
            new Vector3(929, 58, -640)
        ]

        let templeFin : TempleTorch = new TempleTorch(this, new Vector3(1100, 58, -1000), new Vector3(0, Math.PI*3/2, 0), new Vector3(1, 1, 1));
        this.addComponent(templeFin);
        this.addGameObject(templeFin);

        ennemyPositions.forEach(position => {
            this.enemyManager.addDistanceEnemy(position);
        });


        destructableWalls.forEach(wall => {
            this.addComponent(wall.wall);
            this.addGameObject(wall.wall);
        });

        Cards.forEach(cardAndPosition => {
            let cardSocle = new CardSocle(this, cardAndPosition.card, cardAndPosition.position);
            this.addComponent(cardSocle);
            this.addGameObject(cardSocle);
            if (cardSocle.card instanceof FlammeCard) {
                this.addComponent(cardSocle.card.projectile);
                this.addGameObject(cardSocle.card.projectile);
            }
        })
    }
}
