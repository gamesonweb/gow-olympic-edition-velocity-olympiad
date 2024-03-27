import {ICard} from "../ICard.ts";
import {Mesh} from "@babylonjs/core";


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

    setup() {
        // Setup the card
        this.mesh = new Mesh('flamme', null);
    }
}