import { Mesh, Nullable, Scene, SceneLoader, Vector3,PhysicsShapeType, PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicShapeOptions, PhysicsShapeMesh} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SceneComponent } from "../../scenes/SceneComponent";
export class TempleTorch extends SceneComponent {
    private scene: Scene;
    private position: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private mesh: Nullable<Mesh>;
    private body: Nullable<PhysicsBody>;

    constructor(scene: Scene, position: Vector3,rotation: Vector3, scale = new Vector3(1, 1, 1)){
        super();
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.mesh = null;
        this.body = null;
        this.rotation = rotation;
        this.init();
    }
    

    init() {
        SceneLoader.ImportMesh("", "models/", "TorchTemple.glb", this.scene, (meshes) => {
            const root = meshes[0];
            root.position = this.position;
            root.rotation = this.rotation;
            root.scaling = this.scale;
            const childrens = root.getChildren();
            
            for (let child of childrens){
                const mesh = child as Mesh;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC,false, this.scene);
                body.shape = new PhysicsShapeMesh(mesh,this.scene)
            }
        });
    }

    destroy() {
        //TODO 
    }
}