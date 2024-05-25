import {AnimationGroup, AbstractMesh, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import {Character} from "../interfaces/Character.ts";
import {fireballDistanceEnemy} from "../../gameObjects/Spell/fireballDistanceEnemy.ts";

export class DistanceEnemy implements Character {
    position: Vector3;
    mesh!: AbstractMesh;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    idleAnimation: AnimationGroup | null;

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
        });

        setInterval(() => {
            this.attack();
        }, 10000);
    }

    takeDamage(amount: number): void {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.mesh?.dispose();
        }
    }

    attack(): void {
        // Attack the player
        // make him launch a projectile fireball
        new fireballDistanceEnemy().init(this.scene, this.position.clone(), 10)
        console.log(" is attacking the player")
    }
}
