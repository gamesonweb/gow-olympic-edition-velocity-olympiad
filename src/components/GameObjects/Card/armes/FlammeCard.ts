import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {FirstPersonPlayer} from "../../../../BabylonCodes/Character/players/firstPersonPlayer.ts";
import {Color3, MeshBuilder, PhysicsAggregate, PhysicsShapeType, StandardMaterial} from "@babylonjs/core";


export class FlammeCard implements ICard{
    firstSpell(FirstPersonPlayer: FirstPersonPlayer): void {
    FirstPersonPlayer.cardlist.nextCard();

    let engine = FirstPersonPlayer.engine;
    let scene = FirstPersonPlayer.scene;
    let camera = FirstPersonPlayer.camera;
    let player = FirstPersonPlayer;
    let card = this;

    // Create fireball mesh
    let fireball = MeshBuilder.CreateSphere("fireball", { diameter: 1 }, scene);
    fireball.checkCollisions = true;
    fireball.position = camera.position.clone(); // Clone the position of the camera
    let fireballMaterial = new StandardMaterial("fireballMaterial", scene);
    fireballMaterial.diffuseColor = new Color3(1, 0, 0);
    fireball.material = fireballMaterial;

    // Set velocity and direction
    let direction = camera.getFrontPosition(2).subtract(camera.position).normalize();
    let velocity = 0.5;

    // Update fireball position
    scene.onBeforeRenderObservable.add(() => {
        fireball.position.addInPlace(direction.scale(velocity));
    });

    // Dispose fireball after reaching certain distance
    scene.registerBeforeRender(() => {
        if (fireball.intersectsMesh(player.mesh, false)) {
            // Fireball hit the player, you might want to add some logic here
            fireball.dispose();
        }
        if (fireball.position.subtract(camera.position).length() > 100) {
            // Assuming 100 is the maximum distance traveled by fireball
            fireball.dispose();
        }
    });

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