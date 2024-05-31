import {
    Engine,
    HDRCubeTexture,
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
import {FirstLevelEnemyManager} from "./enemyManager";
import {Player, PlayerState} from "../../character/players";
import {TempleV2} from "../../gameObjects/TempleV2";
import {EnemyManager} from "../EnemyManager.ts";
import { Sign } from "../../gameObjects/Sign/index.ts";

export class LevelSelectorScene extends OlympiadScene {
    protected readonly enemyManager: EnemyManager;
    // noinspection JSUnusedGlobalSymbols
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];

    constructor(engine: Engine, playerState: PlayerState) {

        super(engine);
        this.engine = engine;
        this.enemyManager = new FirstLevelEnemyManager(this);
        this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

        this.player = new Player(playerState, this);
    }

    public async init(): Promise<void> {
        await super.init();
        this.player.init(new Vector3(0, 50, -80));
        this.enemyManager.init();
        await this._buildlevelStatic();
        this.addComponent(this.player);
        this.addGameObject(this.player);
    }

    public destroy(): void {
        this._meshes.forEach((mesh) => mesh.dispose());
        this._materials.forEach((material) => material.dispose());
        super.destroy();
    }

    private _buildlevelStatic(): void {
        SceneLoader.ImportMesh("", "models/", "SelectLevelScene.glb", this, (meshes) => {
            const root = meshes[0];
            root.position = new Vector3(0, 0, 0);
            root.rotation = new Vector3(0, 0, 0);
            root.scaling = new Vector3(1, 1, 1);
            const childrens = root.getChildren();

            for (let child of childrens) {
                const mesh = child as Mesh;
                mesh.renderingGroupId = 2;
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

        const temple = new TempleV2(this, new Vector3(125, 37, 157), new Vector3(0, -110 * (Math.PI / 180.0), 0), new Vector3(1, 1, 1), this.engine);
        this.addComponent(temple);

        //Signs 

        let signs = [
            {text : "Appuiez sur ZQSD pour vous deplacez", position : new Vector3(0, 8.5, -78)},
        ]

        signs.forEach(element => {
            let sign = new Sign(element.text, element.position, this);
            this.addComponent(sign);
        });



        

    }
}
