import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {FirstPersonPlayer} from "../../../../BabylonCodes/Character/players/firstPersonPlayer.ts";
import {
    Color3, Color4,
    MeshBuilder,
    ParticleSystem, Path3D,
    PhysicsAggregate,
    PhysicsShapeType, Scene,
    StandardMaterial, Texture, Vector3
} from "@babylonjs/core";

import {Player} from "../../../character/players";


export class FlammeCard implements ICard {

    private _firstSpellCalled: boolean = false;
    private _secondSpellCalled: boolean = false;

    public firstSpell(_scene : Scene, position : Vector3): void {
        if (this._firstSpellCalled) return;
        this._firstSpellCalled = true;
        let color1 = Color3.FromInts(249, 115, 0);
        let color2 = Color3.FromInts(222, 93, 54);
        let texture = "https://raw.githubusercontent.com/oriongunning/t5c/main/public/textures/particle_01.png";
        let textureParticule = new Texture(texture);
        let scene = _scene;

        let camera = scene.activeCamera;
        if (!camera) return; // Return if there's no active camera

        let start = position;
        start.y += 1;

        // Calculate end position based on camera direction
        let end = camera.getTarget().subtract(camera.position).normalize().scaleInPlace(100).add(camera.position);

        // calculate angle
        var angle = Math.atan2(start.z - end.z, start.x - end.x);

        // create material
        var material = new StandardMaterial("player_spell");
        material.diffuseColor = color1;
        material.alpha = 0.1;

        // create mesh
        var projectile = MeshBuilder.CreateSphere("Projectile", {segments: 4, diameter: 0.4}, scene);
        projectile.material = material;
        projectile.position = start.clone();
        projectile.rotation.y = Math.PI / 2 - angle;

        //particule
        var particleSystem = new ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = textureParticule;
        particleSystem.emitter = projectile;
        particleSystem.minEmitBox = new Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0, 0, 0);
        particleSystem.color1 = color1;
        particleSystem.color2 = color2;
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

        // move
        var endVector = projectile.calcMovePOV(0, 0, 100).addInPlace(projectile.position);
        var points = [start, endVector];
        var path = new Path3D(points);
        var i = 0;
        var loop = scene.onBeforeRenderObservable.add(() => {
            if (i < 1) {
                projectile.position = path.getPointAt(i);
                i += 0.001;
            } else {
                projectile.dispose();
                scene.onBeforeRenderObservable.remove(loop);
            }
        });
    }


    secondSpell(): void {
        if (this._secondSpellCalled) return;
        this._secondSpellCalled = true;
        console.log('Second spell');
    }

    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    meshname: string;
    rarete: RareteCard;

    constructor(rarete: RareteCard) {
        this.rarete = rarete;
        switch (rarete) {
            case RareteCard.COMMON:
                this.meshname = "TorchCardGray.glb";
                break;
            case RareteCard.RARE:
                this.meshname = "TorchCardBlue.glb"
                break;
            case RareteCard.EPIC:
                this.meshname = "TorchCardPurple.glb";
                break;
            case RareteCard.LEGENDARY:
                this.meshname = "TorchCardGold.glb";
                break;
        }
    }

    setup() {
        // Setup the card
    }


}
