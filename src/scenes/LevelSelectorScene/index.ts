import {
    Engine, Vector3, Mesh,
    SceneLoader, PhysicsBody, PhysicsShapeMesh, PhysicsMotionType, Material,
    MeshBuilder,
    StandardMaterial,
    Texture,
    CubeTexture,
    HDRCubeTexture
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
        this.player.init(new Vector3(0, 25, -80));
        this.enemyManager.init();
        this._buildlevelStatic();
    }

    private _buildlevelStatic(): void {
        SceneLoader.ImportMesh("", "models/", "SelectLevelScene.glb", this, (meshes) => {
            const root = meshes[0];
            root.position = new Vector3(0, 0, 0);
            root.rotation = new Vector3(0, 0, 0);
            root.scaling = new Vector3(1, 1, 1);
            const childrens = root.getChildren();

            for (let child of childrens){
                const mesh = child as Mesh;
                mesh.renderingGroupId = 2;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC,false, this);
                body.shape = new PhysicsShapeMesh(mesh,this)
            }
            // new PhysicsAggregate(root, PhysicsShapeType.BOX, {mass: 0}, this);
        });

        //Adding a Skybox 

        const skybox = MeshBuilder.CreateBox("skyBox", {size: 1024}, this);
        skybox.renderingGroupId = 0;
        const skyboxMaterial = new StandardMaterial("skyBox", this);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        
        skyboxMaterial.reflectionTexture = new HDRCubeTexture("textures/skybox/skybox.hdr", this,512);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }

    public destroy(): void {
        this._meshes.forEach((mesh) => mesh.dispose());
        this._materials.forEach((material) => material.dispose());
        super.destroy();
    }
}
