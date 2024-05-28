import {
    Camera,
    Color3,
    Color4,
    Mesh,
    MeshBuilder,
    Observer,
    ParticleSystem,
    Path3D,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {SceneComponent} from "../../scenes/SceneComponent.ts";
import {Player} from "../../character/players";


export class FireballDistanceEnemy extends SceneComponent implements GameObject {
    canActOnCollision: boolean = true;
    canDetectCollision: boolean = true;
    private _scene!: Scene;
    private _position!: Vector3;
    private _mesh!: Mesh;
    private _material!: StandardMaterial;
    private _loop_observer!: Observer<Scene>;
    private _isExpired: boolean = false;
    private _asDamegePlayer!: boolean;

    constructor() {
        super();
    }

    private _damage!: number;

    public get damage(): number {
        return this._damage;
    }

    init(scene: Scene, position: Vector3, damage: number) {
        this._scene = scene;
        this._position = position;
        this._damage = damage;
        this._asDamegePlayer = false
        // Create the mesh
        let color1 = Color3.FromInts(70, 0, 130); // Violet
        let color2 = Color3.FromInts(0, 0, 255); // Bleu

        this._material = new StandardMaterial("bouleDeFeuEnemyProjectileMaterial", this._scene);
        this._material.diffuseColor = color1;
        this._material.alpha = 0.1;


        // Calculate end position based on camera direction
        let camera: Camera = <Camera>this._scene.activeCamera;
        let start = this._position;
        start.y += 1;

        // Calculate end position based on camera direction
        let end = camera.position.clone();
        end.y -= 2;
        var angle = Math.atan2(start.z - end.z, start.x - end.x);

        var diffY = end.y - start.y;

        this._mesh = MeshBuilder.CreateSphere("bouleDeFeuEnemyProjectile", {diameter: 0.4}, this._scene);
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

        var endVector = this._mesh.calcMovePOV(0, diffY, 100).addInPlace(this._mesh.position);
        var points = [start, endVector];
        var path = new Path3D(points);
        var i = 0;

        this._loop_observer = this._scene.onBeforeRenderObservable.add(() => {
            // Calcule le déplacement en fonction de la vitesse du projectile
            let newPosition = path.getPointAt(i).subtract(this._mesh.position).normalize()
            this._mesh.position.addInPlace(newPosition);
            i += 0.003;
            if (i >= 1) {
                this._isExpired = true;
            }
        });
    }

    destroy() {
        this._scene.onBeforeRenderObservable.remove(this._loop_observer);
        this._material.dispose();
        this._mesh.dispose();
    }

    public updateState() {
        if (this._isExpired) {
            this.destroy();
        }
    }

    public detectCollision(gameObjects: GameObject[]) {
        if (this._isExpired) {
            this.destroy();
            gameObjects.splice(gameObjects.indexOf(this), 1);
            return;
        }

        if (this.canDetectCollision) {
            gameObjects.forEach((gameObject) => {
                if (!this._asDamegePlayer) {
                    if (gameObject instanceof Player) {
                        if (this._mesh.intersectsMesh(gameObject.mesh, true)) {
                            gameObject.onCollisionCallback(this);
                            this._asDamegePlayer = true;
                            this.destroy()
                        }
                    }
                }
            });

        }

    }

    public onCollisionCallback(gameObject: GameObject) {
        throw new Error("FireballDistanceEnemy should not act on collision. It is supposed to be destroyed on " +
            "collision." + gameObject.toString());
    }
}
