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
