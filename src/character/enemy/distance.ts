import {
    AbstractMesh,
    AnimationGroup, Mesh,
    PhysicsBody, PhysicsMotionType, PhysicsShapeMesh,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import {Character} from "../interfaces/Character.ts";
import {FireballDistanceEnemy} from "../../gameObjects/Spell/FireballDistanceEnemy.ts";
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";


export class DistanceEnemy implements Character, GameObject {
    position: Vector3;
    mesh: AbstractMesh | null;
    scene!: Scene;
    hp: number;
    isFlying: boolean;
    idleAnimation: AnimationGroup | null;
    attackAvailable: boolean;
    canActOnCollision: boolean = false;
    canDetectCollision: boolean = false;
    private meshEye: any[];


    constructor(scene: Scene, position: Vector3) {
        this.position = position;
        this.scene = scene;
        this.hp = 100;
        this.isFlying = false;
        this.mesh = null;
        this.idleAnimation = null;
        this.attackAvailable = true;
        this.meshEye = [];
    }

    init(): void {


        SceneLoader.ImportMesh("", "models/character/enemy/", "enemy_distance.glb", this.scene, (meshes) => {
            const root = meshes[0];
            root.position = this.position;
            let scale = 0.3;
            root.scaling = new Vector3(scale, scale, scale);

            const childMeshes = root.getChildMeshes();

            for (let child of childMeshes) {
                const mesh = child as Mesh;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this.scene);
                body.shape = new PhysicsShapeMesh(mesh, this.scene);

            //     si c'est l'oeil on le fait look at le joueur
                if (mesh.name.includes("Eye")) {
                    mesh.parent = null;
                    mesh.position = this.position;
                    mesh.scaling = new Vector3(scale, scale, scale);
                    this.meshEye.push(mesh);
                }
            }
            this.mesh = root;



        });


        //     make him attack if he is in range of the player
        let distanceToAttack = 50;
        this.scene.registerBeforeRender(() => {
                if (this.scene.activeCamera) {
                    if (this.mesh && this.mesh.position.subtract(this.scene.activeCamera.position).length() < distanceToAttack) {
                        this.lauchAttack();
                    }
                    this.meshEye.forEach((eye) => {
                        let goodposition = this.scene.activeCamera!.position.clone();
                        goodposition.y = eye.position.y+0.05;
                        eye.lookAt(goodposition);
                    });

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
        fireballposition.y += 2.5;
        let fireball = new FireballDistanceEnemy();
        fireball.init(this.scene, fireballposition, 10);
        let olympiadScene = this.scene as OlympiadScene;
        olympiadScene.addGameObject(fireball);

    }


    onCollisionCallback(gameObject: GameObject): void {
        throw new Error("Method not implemented yet.");
        gameObject;
    }

    detectCollision(gameObjects: GameObject[]): void {
        throw new Error("Method not implemented yet.");
        gameObjects;
    }

    updateState(): void {
        return;
    }


}
