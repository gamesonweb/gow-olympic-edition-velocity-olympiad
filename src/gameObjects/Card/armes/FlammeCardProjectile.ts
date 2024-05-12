import {
    Camera,
    Color3,
    Color4,
    Mesh,
    MeshBuilder, Observer,
    ParticleSystem, Path3D,
    Scene,
    StandardMaterial, Texture,
    Vector3
} from "@babylonjs/core";
import {SceneComponent} from "../../../scenes/SceneComponent.ts";
import {Wall} from "../../Wall";

export class FlammeCardProjectile extends SceneComponent implements GameObject {
    canActOnCollision: boolean = true;
    canDetectCollision: boolean = true;
    private _scene!: Scene;
    private _position!: Vector3;
    private _mesh!: Mesh;
    private _material!: StandardMaterial;
    private _loop_observer!: Observer<Scene>;
    private _isExpired: boolean = false;

    constructor() {
        super();
    }

    init(scene: Scene, position: Vector3) {
        this._scene = scene;
        this._position = position;
        // Create the mesh
        let color1 = Color3.FromInts(249, 115, 0);
        let color2 = Color3.FromInts(222, 93, 54);

        this._material = new StandardMaterial("flammeCardProjectileMaterial", this._scene);
        this._material.diffuseColor =  color1;
        this._material.alpha = 0.1;



        // Calculate end position based on camera direction
        let camera: Camera = <Camera> this._scene.activeCamera;
        let start = this._position;
        start.y += 1;

        // Calculate end position based on camera direction
        let end = camera.getTarget().subtract(camera.position).normalize().scaleInPlace(100).add(camera.position);
        var angle = Math.atan2(start.z - end.z, start.x - end.x);


        this._mesh = MeshBuilder.CreateSphere("flammeCardProjectile", {diameter: 0.4}, this._scene);
        this._mesh.position = this._position;
        this._mesh.material = this._material;
        this._mesh.position = start.clone();
        this._mesh.rotation.y = Math.PI / 2 - angle;

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

        var endVector = this._mesh.calcMovePOV(0, 0, 100).addInPlace(this._mesh.position);
        var points = [start, endVector];
        var path = new Path3D(points);
        var i = 0;
        this._loop_observer = this._scene.onBeforeRenderObservable.add(() => {
            this._mesh.position = path.getPointAt(i);
            i += 0.001;
        });
        setTimeout(() => {
            this._isExpired = true;
        }, 10000);
    }

    destroy() {
        this._scene.onBeforeRenderObservable.remove(this._loop_observer);
        this._material.dispose();
        this._mesh.dispose();
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
                    gameObject.onCollisionCallback(this);
                    this.destroy();
                    gameObjects.splice(gameObjects.indexOf(this), 1);
                }
            }
        }

    }

    public onCollisionCallback() {
        this.destroy();
    }
}
