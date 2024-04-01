/**
 * Index class hérite de Character
 * Dépalcement du joueur
 * movement
 * prendre des dégats
 */

import {
    Scene,
    Vector3,
    Color3,
    Mesh,
    PhysicsAggregate,
    TransformNode,
    MeshBuilder,
    StandardMaterial, PhysicsShapeType
} from "@babylonjs/core";
import { Character } from "../interfaces/Character";
import {SceneComponent} from "../../scenes/SceneComponent";
import {PlayerState} from "./PlayerState";

export class Player extends SceneComponent implements Character {
    protected hp: number;
    protected isFlying: boolean;
    protected frontVector: Vector3;
    protected rightVector: Vector3;
    protected aggregate: PhysicsAggregate | null = null;
    protected playerNode: TransformNode;
    protected speed: number = 0.5;
    protected grounded: boolean = false;
    protected scene: Scene;
    public playerState: PlayerState;
    protected movement_keys = { left: false, right: false, forward: false, back: false, jump: false };
    protected mesh: Mesh | null = null;

    constructor(playerState: PlayerState, scene: Scene) {
        super();
        this.scene = scene;
    }

    init(): void {
        this.hp = 100
        this.isFlying = false
        this.frontVector = new Vector3(0, 0, 1);
        this.rightVector = new Vector3(1, 0, 0);
    }

    get rotation(): Vector3 {
        return this.mesh!.rotation;
    }

    set rotation(rotation: Vector3) {
        this.mesh!.rotation = rotation;
    }

    get position(): Vector3 {
        return this.mesh!.position;
    }

    set position(position: Vector3) {
        this.mesh!.position = position;
    }

    public takeDamage(amount: number): void {
        this.hp -= amount;
    }

    public updatePosition() {
        const keys = this.movement_keys;
        const observable = this.aggregate?.body.getCollisionObservable();
        if (observable) {
            const observer = observable.add((collisionEvent) => {
                if (collisionEvent.collidedAgainst.transformNode.name.includes("ground") || collisionEvent.collider.transformNode.name.includes("ground")) {
                    this.grounded = true;
                }
            });
        }

        if (this.mesh == null) {console.log("mesh: ", this.mesh);}

        if (this.mesh !== null) {
            if (!keys.left && !keys.right && !keys.forward && !keys.back && !keys.jump && this.grounded) {
                const frictionForce = this.aggregate?.body.getLinearVelocity().scale(-0.1); // Adjust the friction factor as needed
                if (frictionForce) {
                    this.aggregate?.body.applyImpulse(frictionForce, this.position);
                }
            }
            if (keys.forward) {
                this.aggregate?.body.applyImpulse(this.frontVector.scale(this.speed), this.position);
            }
            if (keys.back) {
                this.aggregate?.body.applyImpulse(this.frontVector.scale(-this.speed), this.position);
            }
            if (keys.right) {
                console.log("right")
                this.aggregate?.body.applyImpulse(this.rightVector.scale(this.speed * 0.5), this.position);
            }
            if (keys.left) {
                this.aggregate?.body.applyImpulse(this.rightVector.scale(-this.speed * 0.5), this.position);
            }
            if (keys.jump) {
                if (this.grounded) {
                    this.aggregate?.body.applyImpulse(new Vector3(0, 1, 0).scale(this.speed * 30), this.position);
                    this.grounded = false;
                }
            }
            this.aggregate?.body.setAngularVelocity(new Vector3(0, 0, 0));
            this.playerNode.position = this.position;
        }
    }

    public destroy(): void {}
}
