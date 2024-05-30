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

    private _createDynamic(){
        //Adding a light

        this._light = new HemisphericLight("light", new Vector3(0, 10, 0), this);

        //Adding Destructable Walls and Cards

        let Cards =[
            {card: new FlammeCard(RareteCard.COMMON), position: new Vector3(-42, 10.5, -155)},
            {card: new JumpCard(RareteCard.LEGENDARY), position: new Vector3(-50, 10.5, -155)}
        ]

        let destructableWalls = [
            {wall : new Wall(this,new Vector3(-7, 10.5, -226), 40, 30, new Vector3(0, -Math.PI/5, 0))},
            {wall : new Wall(this,new Vector3(43, 12.5, -404), 40, 30, new Vector3(0, -Math.PI/5, 0))}
        ]

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
