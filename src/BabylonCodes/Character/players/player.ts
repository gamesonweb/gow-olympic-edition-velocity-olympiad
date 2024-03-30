import {
    Axis,
    Camera,
    Color3,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    StandardMaterial,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import {Character} from "../Character.ts";


export class Player implements Character {
    position: Vector3;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    rotation: Vector3;
    frontVector: Vector3;
    rightVector: Vector3;
    mesh: any | null;
    aggregate: PhysicsAggregate | null;
    playerNode: TransformNode;
    camera: Camera;
    speed: number = 0.5;
    grounded: boolean = false;

    constructor(scene: Scene, camera: Camera) {
        this.position = new Vector3(0, 100, 0);
        this.mesh = null;
        this.scene = scene;
        this.hp = 100
        this.isFlying = false
        this.rotation = new Vector3(0, 0, 0);
        this.frontVector = new Vector3(0, 0, 1);
        this.rightVector = new Vector3(1, 0, 0);
        this.scene = scene;
        this.mesh = null;
        this.aggregate = null;
        this.playerNode = new TransformNode("player", this.scene);
        this.camera = camera;
        this.setupCharacter();
    }

    setupCharacter() {
        this.mesh = this.CreateMesh();
    }

    CreateMesh() {
        const mesh = MeshBuilder.CreateBox("player", { size: 1 });
        mesh.position = new Vector3(0, 50, 0);
        const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new Color3(0, 0, 1);
        mesh.material = playerMaterial;
        const aggregate = new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 1, friction: 0.5, restitution: 0.1 }, this.scene);
        this.aggregate = aggregate;
        this.rotation = mesh.rotation;
        aggregate.body.setCollisionCallbackEnabled(true);
        return mesh;
    }



    takeDamage(amount: number): void {
        this.hp -= amount;
    }

    updatePosition(keys: { left: boolean, right: boolean, forward: boolean, back: boolean, jump: boolean }) {
        // Utilisez la direction de la caméra pour déterminer le frontVector
        this.frontVector = this.camera.getDirection(Axis.Z);
        this.rightVector = this.camera.getDirection(Axis.X);
        // console.log("keys: ", keys)
        const observable = this.aggregate?.body.getCollisionObservable();
        if (observable) {
            const observer = observable.add((collisionEvent) => {
                if (collisionEvent.collidedAgainst.transformNode.name === "ground" || collisionEvent.collider.transformNode.name === "ground") {
                    this.grounded = true;
                }
            });
        }

        if(this.mesh == null)  console.log("mesh: ", this.mesh);
        if (this.mesh !== null) {
            if (!keys.left && !keys.right && !keys.forward && !keys.back && !keys.jump && this.grounded) {
                const frictionForce = this.aggregate?.body.getLinearVelocity().scale(-0.1); // Adjust the friction factor as needed
                if (frictionForce) {
                    this.aggregate?.body.applyImpulse(frictionForce, this.mesh.position);
                }
            }
            if (keys.forward) {
                this.aggregate?.body.applyImpulse(this.frontVector.scale(this.speed), this.mesh.position);
            }
            if (keys.back) {
                this.aggregate?.body.applyImpulse(this.frontVector.scale(-this.speed), this.mesh.position);
            }
            if (keys.right) {
                console.log("right")
                this.aggregate?.body.applyImpulse(this.rightVector.scale(this.speed * 0.5), this.mesh.position);
            }
            if (keys.left) {
                this.aggregate?.body.applyImpulse(this.rightVector.scale(-this.speed * 0.5), this.mesh.position);
            }
            if (keys.jump) {
                if (this.grounded) {
                    this.aggregate?.body.applyImpulse(new Vector3(0, 1, 0).scale(this.speed * 30), this.mesh.position);
                    this.grounded = false;
                }
            }

            this.aggregate?.body.setAngularVelocity(new Vector3(0, 0, 0));
            this.playerNode.position = this.mesh.position;
            this.rotation.x = this.camera.absoluteRotation.x;
            this.rotation.y = this.camera.absoluteRotation.y;
            this.camera.position.x = this.mesh.position.x;
            this.camera.position.y = this.mesh.position.y + 2;
            this.camera.position.z = this.mesh.position.z;
        }
    }
}
