import {AbstractMesh, AnimationGroup, Quaternion, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import {Character} from "../interfaces/Character.ts";
import {FireballDistanceEnemy} from "../../gameObjects/Spell/FireballDistanceEnemy.ts";
import {SceneComponent} from "../../scenes/SceneComponent.ts";
import {Player} from "../players";
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";

export class DistanceEnemy implements Character, GameObject, SceneComponent {
    position: Vector3;
    mesh!: AbstractMesh;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    idleAnimation: AnimationGroup | null;
    canActOnCollision: boolean = false; // Not an actor
    canDetectCollision: boolean = true; // Can detect object positions to attack them
    private _attackRange = 20;
    private _lastAttackTime: number = 0;
    private _intervalMsBetweenAttacks = 3000;

    constructor(scene: Scene, position: Vector3) {
        this.position = position;
        this.scene = scene;
        this.hp = 100;
        this.isFlying = false;
        this.idleAnimation = null;
    }

    init(): void {
        // this.mesh = MeshBuilder.CreateBox("distanceEnemy", {size: 2}, this.scene);
        // this.mesh.position = this.position;

        SceneLoader.ImportMesh("", "models/", "enemy_distance.glb", this.scene, (meshes) => {
            this.mesh = meshes[0];
            this.mesh.position = this.position;
            let scale = 2;
            this.mesh.scaling = new Vector3(scale, scale, scale);
            this.scene.onBeforeRenderObservable.add(() => {
                this.rotateMeshTowardsCamera();
            });
        });
    }

    rotateMeshTowardsCamera() {
        // Ensure camera exists and mesh is loaded
        if (this.scene.activeCamera && this.mesh) {
            const cameraPosition = this.scene.activeCamera.position;
            const meshPosition = this.mesh.position;

            const directionXZ = cameraPosition.subtract(meshPosition);
            directionXZ.y = 0; // Ignore the Y component

            this.mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(
                Math.atan2(directionXZ.x, directionXZ.z),
                0, // Assuming you don't want any pitch (up and down rotation)
                0  // Assuming you don't want any roll (sideways rotation)
            );
        }
    }

    takeDamage(amount: number): void {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.mesh?.dispose();
        }
    }

    public attack(playerPosition: Vector3): void {
        // Check if the enemy can attack
        if (this._lastAttackTime + this._intervalMsBetweenAttacks > Date.now()) {
            return;
        }
        // Calculate the direction from the enemy to the player
        const direction = playerPosition.subtract(this.position.clone()).normalize();

        // Launch the fireball in the direction of the player
        let fireballEnemy = new FireballDistanceEnemy()
        fireballEnemy.init(this.scene, this.position.clone(), 10, direction);

        let olympiadScene = <OlympiadScene>this.scene;
        olympiadScene.gameObjects.push(fireballEnemy);

        this._lastAttackTime = Date.now();
    }

    public detectCollision(gameObjects: GameObject[]) {
        gameObjects.forEach((gameObject) => {
            if (gameObject instanceof Player) {
                // If the player is at a certain distance, attack
                let distance = Vector3.Distance(this.position, gameObject.position);
                if (distance <= this._attackRange) {
                    this.attack(gameObject.position);
                }
            }
        });
    }


    public onCollisionCallback(gameObject: GameObject): void {
        throw new Error("DistanceEnemy should not act itself on collision" + gameObject.toString());
    }

    public destroy() {
        this.mesh.dispose();
    }
}
