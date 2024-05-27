import {
    Engine,
    Material,
    Mesh,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShapeMesh,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import {Player, PlayerState} from "../../character/players";

export class LevelSelectorScene extends OlympiadScene {
    // noinspection JSUnusedGlobalSymbols
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];
    private readonly enemyManager: WelcomeEnemyManager;

    constructor(engine: Engine, playerState: PlayerState) {

        super(engine);

        this.enemyManager = new WelcomeEnemyManager(this);
        this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

        this.player = new Player(playerState, this);
        this.addComponent(this.player);
    }

    public async init(): Promise<void> {
        await super.init();
        this.player.init(new Vector3(0, 100, 0));
        this.enemyManager.init();
        this._buildlevelStatic();
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
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this);
                body.shape = new PhysicsShapeMesh(mesh, this)
            }
            // new PhysicsAggregate(root, PhysicsShapeType.BOX, {mass: 0}, this);
        });
    }

    public restart() {
        let newScene = new LevelSelectorScene(this.getEngine(), this.player.playerState);
        newScene.init().then(() => {
            this.destroy()
        });
    }
}
