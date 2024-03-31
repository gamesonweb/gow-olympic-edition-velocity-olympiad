import {Engine, Mesh, Nullable, Quaternion, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {ICard} from "./ICard.ts";
import {OurScene} from "../../../BabylonCodes/scenes";

export class CardSocle {
    position: Vector3;
    scene: Scene;
    engine: Engine;
    card: ICard;
    private mesh: Nullable<Mesh>;
    private our_scene: OurScene;


    constructor(ourScene: OurScene, card: ICard, position: Vector3) {
        this.our_scene = ourScene;
        this.scene = this.our_scene.scene;
        this.engine = this.our_scene.engine;
        this.card = card;
        this.position = position;
        this.setup();
    }

    setup() {
        // Setup the socle
        SceneLoader.ImportMesh("", "./models/", this.card.meshname, this.scene, (meshes) => {
            this.mesh = meshes[0] as Mesh;


            // Set up rendering loop to continually rotate the mesh to face the camera
            this.scene.onBeforeRenderObservable.add(() => {
                this.rotateMeshTowardsCamera();
            });
            this.mesh.position = this.position;

            console.log("Card socle loaded at position: ", this.position.toString());
        });
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
            // Check for collision with camera
            if (this.checkCollisionWithCamera()) {
                // Log collision
                console.log("Collision occurred!");

                // Remove the mesh from the scene
                this.mesh.dispose();
                this.mesh = null; // Mark mesh as disposed

                this.our_scene.player.cardlist.push(this.card);
                // this.our_scene._guiUpdate();
            }
        }
    }

    checkCollisionWithCamera(): boolean {

        // Check if the camera is within 1 unit of the mesh

        return this.mesh.position.subtract(this.scene.activeCamera.position).length() < 3;


    }


}
