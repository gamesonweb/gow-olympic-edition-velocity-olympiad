import {
    Color3,
    Color4,
    Mesh,
    MeshBuilder,
    Observer,
    ParticleSystem,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {SceneComponent} from "../../scenes/SceneComponent.ts";
import {Player} from "../../character/players";


export class FireballDistanceEnemy extends SceneComponent implements GameObject {
    canActOnCollision: boolean = false;
    canDetectCollision: boolean = true;
    private _scene!: Scene;
    private _position!: Vector3;
    private _mesh!: Mesh;
    private _material!: StandardMaterial;
    private _loop_observer!: Observer<Scene>;
    private _isExpired: boolean = false;
    public damage!: number;


    constructor() {
        super();
    }

    init(scene: Scene, position: Vector3, damage: number, direction: Vector3) {
        this._scene = scene;
        this._position = position;
        this.damage = damage;
        // Create the mesh
        let color1 = Color3.FromInts(70, 0, 130); // Violet
        let color2 = Color3.FromInts(0, 0, 255); // Bleu

        this._material = new StandardMaterial("bouleDeFeuEnemyProjectileMaterial", this._scene);
        this._material.diffuseColor = color1;
        this._material.alpha = 0.1;

        this._mesh = MeshBuilder.CreateSphere("bouleDeFeuEnemyProjectile", { diameter: 0.4 }, this._scene);
        this._mesh.position = this._position;
        this._mesh.material = this._material;


        let texture = "https://raw.githubusercontent.com/oriongunning/t5c/main/public/textures/particle_01.png";
        let textureParticule = new Texture(texture);
        var particleSystem = new ParticleSystem("particles", 2000, this._scene);
        particleSystem.particleTexture = textureParticule;
        particleSystem.emitter = this._mesh;
        particleSystem.minEmitBox = new Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0, 0, 0);
        particleSystem.color1 = color1.toColor4();
        particleSystem.color2 = color2.toColor4();
        particleSystem.colorDead = new Color4(0, 0, 0, 0.0);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;
        particleSystem.emitRate = 1500;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new Vector3(0, -9.81, 0);
        particleSystem.direction1 = new Vector3(-7, 8, 3);
        particleSystem.direction2 = new Vector3(7, 8, -3);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;
        particleSystem.start();

        let normalizedDirection = direction.normalize();

        this._loop_observer = this._scene.onBeforeRenderObservable.add(() => {
            // Move the fireball in the direction of the player
            let moveStep = normalizedDirection.scale(0.3); // Adjust the speed of the fireball by scaling the step
            this._mesh.position.addInPlace(moveStep);
        });

        setTimeout(() => {
            this._isExpired = true;
        }, 5000);
    }

    destroy() {
        this._scene.onBeforeRenderObservable.remove(this._loop_observer);
        this._material.dispose();
        this._mesh.dispose();
    }

    public detectCollision(gameObjects: GameObject[]) {
        if (this._isExpired) {
            gameObjects.splice(gameObjects.indexOf(this), 1);
            this.destroy();
            return;
        }

        if (this.canDetectCollision) {
            gameObjects.forEach((gameObject) => {
                if (gameObject instanceof Player) {
                    if (this._mesh.intersectsMesh(gameObject.mesh, true)) {
                        console.log("FireballDistanceEnemy collision with player")
                        gameObject.onCollisionCallback(this); // Tell the player they collided with a enemy fireball
                        gameObjects.splice(gameObjects.indexOf(this), 1); // Remove the fireball from the gameObjects array
                        this.destroy();
                    }
                }
            });
        }



    }

    public onCollisionCallback(gameObject: GameObject): void {
        throw new Error("FireballDistanceEnemy should not act itself on collision" + gameObject.toString());
    }
}
