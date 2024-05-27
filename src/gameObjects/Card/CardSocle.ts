import {Engine, Mesh, Nullable, Quaternion, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {ICard} from "./ICard.ts";
import {SceneComponent} from "../../scenes/SceneComponent";
import {Player} from "../../character/players";

export class CardSocle extends SceneComponent implements GameObject {
    position: Vector3;
    scene: Scene;
    engine: Engine;
    public card: ICard;
    public canDetectCollision: boolean = true;
    public canActOnCollision: boolean = false;
    private mesh!: Nullable<Mesh>;
    private _meshes: Mesh[] = [];

    constructor(scene: Scene, card: ICard, position: Vector3) {
        super();
        this.scene = scene;
        this.engine = this.scene.getEngine();
        this.card = card;
        this.position = position;
        this.init();
    }

    init() {
        // Setup the socle
        SceneLoader.ImportMesh("", "./models/", this.card.meshname, this.scene, (meshes) => {
            this.mesh = meshes[0] as Mesh;
            this._meshes.push(this.mesh);


            // Set up rendering loop to continually rotate the mesh to face the camera
            this.scene.onBeforeRenderObservable.add(() => {
                this.rotateMeshTowardsCamera();
            });
            this.mesh.position = this.position;

            console.log("Card socle loaded at position: ", this.position.toString());
        });
    }

    public updateState(): void {
        if (this.mesh) {
            this.mesh.position = this.position;
        }
    }

    rotateMeshTowardsCamera() {
        // Ensure camera exists and mesh is loaded
        if (this.scene.activeCamera && this.mesh) {
            // Calculate direction from mesh to camera
            const cameraPosition = this.scene.activeCamera.position;
            const meshPosition = this.mesh.position;

            // Calculate direction without height component (Y axis)
            const directionXZ = cameraPosition.subtract(meshPosition);
            directionXZ.y = 0; // Ignore the Y component

            // Calculate rotation quaternion to align mesh with camera direction
            const rotationQuaternion = Quaternion.RotationYawPitchRoll(
                Math.atan2(directionXZ.x, directionXZ.z),
                0, // Assuming you don't want any pitch (up and down rotation)
                0  // Assuming you don't want any roll (sideways rotation)
            );

            // Apply rotation to mesh
            this.mesh.rotationQuaternion = rotationQuaternion;
        }
    }

    checkCollisionWithCamera(): boolean {

        // Check if the camera is within 1 unit of the mesh

        // console.log("CHECKIN_COLLISION: ", this.mesh!.position.subtract(this.scene.activeCamera!.position).length() < 5)
        if (!this.mesh || !this.scene.activeCamera) return false;

        // compare x and z coordinates first
        const cameraPos = this.scene.activeCamera.position.clone();
        const meshPos = this.mesh.position.clone();

        let xDiff = Math.abs(cameraPos.x - meshPos.x);
        let zDiff = Math.abs(cameraPos.z - meshPos.z);
        let yDiff = Math.abs(cameraPos.y - meshPos.y);


        if (xDiff > 2 || zDiff > 2) return false;
        if (yDiff > 4) return false;
        return true;


    }

    destroy(): void {
        this._meshes.forEach((mesh) => {
            mesh.dispose();
        });
    }

    public detectCollision(gameObjects: GameObject[]) {
        for (let gameObject of gameObjects) {
            if (gameObject.canActOnCollision && gameObject instanceof Player) {
                if (this.checkCollisionWithCamera()) {
                    gameObject.onCollisionCallback(this); // Tell the player they collided with a card
                    gameObjects.splice(gameObjects.indexOf(this), 1); // Remove the card from the gameObjects array
                    this.destroy(); // Destroy the card

                }
            }
        }
    }

    public onCollisionCallback(gameObject: GameObject) {
        throw new Error("CardSocle should not have an onCollisionCallback() method: " + gameObject.toString());
    }

}
