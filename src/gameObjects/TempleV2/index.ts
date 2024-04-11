import {Color3, Mesh, MeshBuilder, Nullable, Scene, SceneLoader, StandardMaterial, TransformNode, Vector3,PhysicsShapeType,PhysicsAggregate} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
export class TempleV2 {
    private scene: Scene;
    private position: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private mesh: Nullable<Mesh>;

    constructor(scene: Scene, position: Vector3,rotation: Vector3, scale = new Vector3(1, 1, 1)){
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.mesh = null;
        this.rotation = rotation;
        this.init();
    }
    

    init() {
        SceneLoader.ImportMesh("", "./models/", "temple.glb", this.scene, (meshes) => {
            this.mesh = meshes[0] as Mesh;
            this.mesh.position = this.position;
            this.mesh.rotation = this.rotation;
            this.mesh.scaling = this.scale;
        });
    }
}