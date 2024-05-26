import {AbstractMesh, AnimationGroup, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import {Character} from "../interfaces/Character.ts";
import {fireballDistanceEnemy} from "../../gameObjects/Spell/fireballDistanceEnemy.ts";

export class DistanceEnemy implements Character, GameObject {
    position: Vector3;
    mesh: AbstractMesh;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    idleAnimation: AnimationGroup | null;
    attackAvailable: boolean;

    constructor(scene: Scene, position: Vector3) {
        this.position = position;
        this.scene = scene;
        this.hp = 100;
        this.isFlying = false;
        this.mesh = null;
        this.idleAnimation = null;
        this.attackAvailable = true;
    }

    init(): void {
        // this.mesh = MeshBuilder.CreateBox("distanceEnemy", {size: 2}, this.scene);
        // this.mesh.position = this.position;

        SceneLoader.ImportMesh("", "models/character/enemy/", "enemy_distance.glb", this.scene, (meshes) => {
            this.mesh = meshes[0];
            this.mesh.position = this.position;
            this.mesh.position.y += 3;
            let scale = 0.05    ;
            this.mesh.scaling = new Vector3(scale, scale, scale);
            // rotate the mesh to make it vertical
            this.mesh.rotation.y = 0;
        });


        // make him always look at the player
        this.scene.registerBeforeRender(() => {
            if (this.scene.activeCamera) {
                if (this.mesh){this.mesh.lookAt(this.scene.activeCamera.position);}

            }
        });
        // make him move in a circle around the initial position in y and xz plane
        let angle = 0;
        let distance = 0.01;
        this.scene.registerBeforeRender(() => {
            if (this.mesh) {
                angle += 0.01;
                this.mesh.position.x = this.position.x + Math.cos(angle) * distance;
                this.mesh.position.z = this.position.z + Math.sin(angle) * distance;
            }
        });

    //     make him attack if he is in range of the player
        let distanceToAttack = 50;
        this.scene.registerBeforeRender(() => {
            if (this.scene.activeCamera) {
                if (this.mesh && this.mesh.position.subtract(this.scene.activeCamera.position).length() < distanceToAttack) {
                    this.lauchAttack();
                }
            }
        }
        );
    }


    takeDamage(amount: number): void {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.mesh?.dispose();
        }
    }

    lauchAttack(): void {
        // Launch the attack
        if (this.attackAvailable) {
            this.attack();
            this.attackAvailable = false;
            setTimeout(() => {
                this.attackAvailable = true;
            }, 5000);
        }
    }

    attack(): void {
        // Attack the player
        // make him launch a projectile fireball
        let fireballposition = this.position.clone();
        fireballposition.y += 0.5;
        new fireballDistanceEnemy().init(this.scene, fireballposition, 10)
        console.log(" is attacking the player")
    }
}
