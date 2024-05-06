import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {FirstPersonPlayer} from "../../../../BabylonCodes/Character/players/firstPersonPlayer.ts";
import {
    Color3, Color4,
    MeshBuilder,
    ParticleSystem,
    PhysicsAggregate,
    PhysicsShapeType,
    StandardMaterial, Texture, Vector3
} from "@babylonjs/core";


export class FlammeCard implements ICard{
    firstSpell(FirstPersonPlayer: FirstPersonPlayer): void {
    FirstPersonPlayer.cardlist.nextCard();

    let engine = FirstPersonPlayer.engine;
    let scene = FirstPersonPlayer.scene;
    let camera = FirstPersonPlayer.camera;
    let player = FirstPersonPlayer;
    let card = this;
    let color1 = Color3.FromInts(249, 115, 0);
    let color2 = Color3.FromInts(222, 93, 54);
    let texturepath = "https://raw.githubusercontent.com/oriongunning/t5c/main/public/textures/particle_01.png"
    let start = camera.position.clone();
    let end = start.clone();
    end.z += 100;


    // Create fireball mesh
    let fireball = MeshBuilder.CreateSphere("fireball", { diameter: 1 }, scene);
    fireball.checkCollisions = true;
    fireball.position = camera.position.clone();

    var angle = Math.atan2(start.z - end.z, start.x - end.x);
    fireball.rotation.y = Math.PI / 2 - angle;





    //  add particle system
    let particleSystem = new ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new Texture(texturepath, scene);
    particleSystem.emitter = fireball; // the starting object, the emitter
    particleSystem.minEmitBox = new Vector3(0, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new Vector3(0, 0, 0); // To...
    particleSystem.color1 = Color4.FromColor3(color1);
    particleSystem.color2 = Color4.FromColor3(color2);
    particleSystem.colorDead = new Color4(0, 0, 0, 0.0);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 1500;






    }

    secondSpell(): void {
        console.log('Second spell');
    }

    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    meshname: string;
    rarete: RareteCard ;

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