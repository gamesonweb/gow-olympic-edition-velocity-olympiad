import {
    Mesh,
    MeshBuilder,
    Nullable,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShapeMesh,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {SceneComponent} from "../../scenes/SceneComponent";
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";

export class TempleTorch extends SceneComponent implements GameObject {
    public fireball: Nullable<Mesh>;
    canActOnCollision: boolean; // If true, the object will call onCollisionCallback() when it collides with another object
    canDetectCollision: boolean; // If true, the object will call detectCollision() to check for collisions with other objects
    private scene: Scene;
    private position: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private mesh: Mesh[];
    private body: PhysicsBody[];

    constructor(scene: Scene, position: Vector3, rotation: Vector3, scale = new Vector3(1, 1, 1)) {
        super();
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.mesh = [];
        this.body = [];
        this.fireball = null;
        this.rotation = rotation;
        this.canActOnCollision = true;
        this.canDetectCollision = true;

        this.init();
    }


    init() {
        SceneLoader.ImportMesh("", "models/", "TorchTemple.glb", this.scene, (meshes) => {
            const root = meshes[0];
            root.position = this.position;
            root.rotation = this.rotation;
            root.scaling = this.scale;
            const childrens = root.getChildren();

            for (let child of childrens) {
                const mesh = child as Mesh;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this.scene);
                body.shape = new PhysicsShapeMesh(mesh, this.scene)
                if (mesh.name === "Fire") {
                    mesh.isVisible = false;
                }
                this.mesh.push(mesh);
                this.body.push(body);
            }
        });

        this.fireball = MeshBuilder.CreateCylinder("Fireball_Detection", {diameter: 7, height: 10}, this.scene);
        this.fireball.position = this.position.add(new Vector3(0, 1.5, 0));
        this.fireball.checkCollisions = true;
        this.fireball.isVisible = false;
        let fireballBody = new PhysicsBody(this.fireball, PhysicsMotionType.STATIC, false, this.scene);
        fireballBody.shape = new PhysicsShapeMesh(this.fireball, this.scene);
        this.body.push(fireballBody);
        this.mesh.push(this.fireball);

    }

    destroy() {
        this.mesh.forEach((mesh) => {
            mesh?.dispose();
        });
        this.body.forEach((body) => {
            body?.dispose();
        });
    }

    onCollisionCallback(gameObject: GameObject) {
        gameObject;
        this.mesh.forEach((mesh) => {
            if (mesh.name === "Fire") {
                mesh.isVisible = true;
                let actualScene = this.scene as OlympiadScene;
                actualScene.player.ui.showWinPanel();
            }
        });
    };

    detectCollision(gameObjects: GameObject[]) {
        gameObjects;
        return;
    }

    updateState(): void {
        return;
    }
}
