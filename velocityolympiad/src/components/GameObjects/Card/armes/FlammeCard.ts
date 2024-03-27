import {ICard} from "../ICard.ts";
import {Mesh, MeshBuilder, PhysicsImpostor} from "@babylonjs/core";
import {RareteCard} from "../RareteCard.ts";


export class FlammeCard implements ICard{
    firstSpell(): void {
        console.log('First spell');
    }

    secondSpell(): void {
        console.log('Second spell');
    }

    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    mesh: Mesh;
    rarete: RareteCard = RareteCard.RARE;

    setup() {
        // Setup the card
        this.mesh =  MeshBuilder.CreateBox('box', {size: 100});
    }

}