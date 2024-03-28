import {ICard} from "../ICard.ts";
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
    mesh: "TorchCard.glb";
    rarete: RareteCard = RareteCard.RARE;

    setup() {
        // Setup the card
    }




}