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
    UniversalCamera,
    Vector3
} from "@babylonjs/core";
import {SceneComponent} from "../../../scenes/SceneComponent.ts";
import {Wall} from "../../Wall";
import {DistanceEnemy} from "../../../character/enemy/distance.ts";

export class FlammeCardProjectile extends SceneComponent implements GameObject {
    canActOnCollision: boolean = true;
    canDetectCollision: boolean = true;
    public damage!: number;
    private _scene!: Scene;
    private _mesh!: Mesh;
    private _material!: StandardMaterial;
    private _loop_observer!: Observer<Scene>;
    private _isExpired: boolean = false;

    constructor() {
        super();
    }

    init(scene: Scene, position: Vector3, damage: number) {
        this._scene = scene;
        this.damage = damage;
        // Create the mesh
        let color1 = Color3.FromInts(249, 115, 0);
        let color2 = Color3.FromInts(222, 93, 54);

        this._material = new StandardMaterial("flammeCardProjectileMaterial", this._scene);
        this._material.diffuseColor = color1;
        this._material.alpha = 0.1;


        this._mesh = MeshBuilder.CreateSphere("flammeCardProjectile", {diameter: 0.4}, this._scene);
        this._mesh.position = position;
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

        // Get direction of the camera
        let camera = <UniversalCamera>this._scene.activeCamera;
        let direction = camera.getForwardRay().direction;

        this._loop_observer = this._scene.onBeforeRenderObservable.add(() => {
            let moveStep = direction.scale(0.3);
            this._mesh.position.addInPlace(moveStep);
        });

        setTimeout(() => {
            this._isExpired = true;
        }, 5000);
    }

    destroy() {
        if (this._scene) {
            this._scene.onBeforeRenderObservable.remove(this._loop_observer);
            this._material.dispose();
            this._mesh.dispose();
        }
    }

    public detectCollision(gameObjects: GameObject[]) {
        if (this._isExpired) {
            this.destroy();
            gameObjects.splice(gameObjects.indexOf(this), 1);
            return;
        }
        for (let gameObject of gameObjects) {
            if (gameObject.canActOnCollision && gameObject instanceof Wall) {
                if (!this._mesh) break;
                if (this._mesh.intersectsMesh(gameObject.mesh)) {
                    gameObject.onCollisionCallback(this); // Tell the wall they collided with a fireball
                    gameObjects.splice(gameObjects.indexOf(this), 1);
                    this.destroy();
                }
            }

            if (gameObject instanceof DistanceEnemy) {
                if (!this._mesh) break;
                let distance = Vector3.Distance(this._mesh.position, gameObject.position);
                if (distance <= 5) {
                    gameObject.onCollisionCallback(this); // Tell the distance enemy they collided with a fireball
                    gameObjects.splice(gameObjects.indexOf(this), 1);
                    this.destroy();
                }
            }
        }

    }

    public updateState() {
        if (this._isExpired) {
            this.destroy();
        }
    }

    public onCollisionCallback() {
        this.destroy();
    }
}
