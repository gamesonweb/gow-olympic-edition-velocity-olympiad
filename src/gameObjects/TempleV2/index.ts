import {
    Engine,
    Mesh,
    MeshBuilder,
    Nullable,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShapeMesh,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {SceneComponent} from "../../scenes/SceneComponent";
import {OlympiadScene} from "../../scenes/OlympiadScene";
import {Player} from "../../character/players";
import {Level1Scene} from "../../scenes/Level1Scene";

export class TempleV2 extends SceneComponent {
    private scene: OlympiadScene;
    private position: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private mesh: Nullable<Mesh>[];
    private body: Nullable<PhysicsBody>[];
    private teleportPad: Nullable<Mesh>;
    private engine: Engine;
    private asTP: boolean;

    constructor(scene: OlympiadScene, position: Vector3, rotation: Vector3, scale = new Vector3(1, 1, 1), engine: Engine) {
        super();
        this.engine = engine;
        this.scene = scene;
        this.scale = scale;
        this.position = position;
        this.mesh = [];
        this.body = [];
        this.teleportPad = null;
        this.rotation = rotation;
        this.asTP = false;
        this.init();
    }


    init() {
        SceneLoader.ImportMesh("", "models/", "temple.glb", this.scene, (meshes) => {
            const root = meshes[0];
            root.position = this.position;
            root.rotation = this.rotation;
            root.scaling = this.scale;
            const childrens = root.getChildren();

            for (let child of childrens) {
                const mesh = child as Mesh;
                mesh.renderingGroupId = 2;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this.scene);
                body.shape = new PhysicsShapeMesh(mesh, this.scene)
                this.mesh.push(mesh);
                this.body.push(body);
            }
        });

        this.teleportPad = MeshBuilder.CreateCylinder("teleportPad", {diameter: 7, height: 10}, this.scene)
        this.teleportPad.position = this.position.add(new Vector3(0, 1.5, 0));
        this.teleportPad.renderingGroupId = 2;
        this.teleportPad.checkCollisions = true;
        this.teleportPad.isVisible = false;
        this.mesh.push(this.teleportPad);

        this.scene.registerBeforeRender(this._callbackBeforeRenderScene.bind(this));
    }

    destroy() {
        this.mesh.forEach((mesh) => {
            mesh?.dispose();
        });
        this.body.forEach((body) => {
            body?.dispose();
        });
    }

    private _callbackBeforeRenderScene(): void {
        if (this.teleportPad === null) return;
        this.scene.gameObjects.forEach((gameObject) => {
            if (this.asTP) return;
            if (gameObject instanceof Player) {
                if (this.teleportPad) {
                    if (this.teleportPad.intersectsMesh(gameObject.mesh, false)) {
                        this.asTP = true;
                        let nextScene = new Level1Scene(this.engine, gameObject.playerState);
                        nextScene.init().then(() => {
                            this.scene.destroy();
                        });
                    }
                }
            }
        });
    }

}