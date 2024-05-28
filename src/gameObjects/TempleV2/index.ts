import { Mesh, Nullable, Scene, SceneLoader, Vector3,PhysicsShapeType, PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicShapeOptions, PhysicsShapeMesh, MeshBuilder} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SceneComponent } from "../../scenes/SceneComponent";
import { OlympiadScene } from "../../scenes/OlympiadScene";
export class TempleV2 extends SceneComponent {
    private scene: Scene;
    private nextScene: OlympiadScene;
    private position: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private mesh: Nullable<Mesh>[];
    private body: Nullable<PhysicsBody>[];
    private teleportPad: Nullable<Mesh>;

    constructor(scene: Scene, position: Vector3,rotation: Vector3, scale = new Vector3(1, 1, 1),nextScene: OlympiadScene){
        super();
        this.nextScene = nextScene;
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.mesh = [];
        this.body = [];
        this.teleportPad = null;
        this.rotation = rotation;
        this.init();
    }
    

    init() {
        SceneLoader.ImportMesh("", "models/", "temple.glb", this.scene, (meshes) => {
            const root = meshes[0];
            root.position = this.position;
            root.rotation = this.rotation;
            root.scaling = this.scale;
            const childrens = root.getChildren();
            
            for (let child of childrens){
                const mesh = child as Mesh;
                mesh.renderingGroupId = 2;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC,false, this.scene);
                body.shape = new PhysicsShapeMesh(mesh,this.scene)
                this.mesh.push(mesh);
                this.body.push(body);
            }
        });

        this.teleportPad= MeshBuilder.CreateCylinder("teleportPad", {diameter: 7, height: 0.1}, this.scene)
        this.teleportPad.position = this.position.add(new Vector3(0, 1.5, 0));
        this.teleportPad.renderingGroupId = 2;
        const tpbody = new PhysicsBody(this.teleportPad, PhysicsMotionType.STATIC, false, this.scene);
        tpbody.shape = new PhysicsShapeMesh(this.teleportPad, this.scene);
        this.teleportPad.isVisible = true;
        this.mesh.push(this.teleportPad);
        this.body.push(tpbody);

        this.scene.registerBeforeRender(this._callbackBeforeRenderScene.bind(this));
    }

    private _callbackBeforeRenderScene(): void {
        if (this.teleportPad === null) return;
            let player = this.scene.getMeshByName("player");
            if (player){
                if(this.teleportPad.intersectsMesh(player, false)){
                    this.nextScene.init().then(() => {
                        this.scene.dispose();
                    });
                }
            }
    }

    destroy() {
        this.mesh.forEach((mesh) => {
            mesh?.dispose();
        });
        this.body.forEach((body) => {
            body?.dispose();
        });
    }
}