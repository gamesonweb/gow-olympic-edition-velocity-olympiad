import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

import {FlammeCardProjectile} from "./FlammeCardProjectile.ts";

export class FlammeCard implements ICard {

    public projectile!: FlammeCardProjectile;
    private damage: number;

    constructor(rarete: RareteCard) {
        this.rarete = rarete;
        switch (rarete) {
            case RareteCard.COMMON:
                this.meshname = "TorchCardGray.glb";
                this.damage = 10;
                break;
            case RareteCard.RARE:
                this.meshname = "TorchCardBlue.glb"
                this.damage = 20;
                break;
            case RareteCard.EPIC:
                this.meshname = "TorchCardPurple.glb";
                this.damage = 50;
                break;
            case RareteCard.LEGENDARY:
                this.meshname = "TorchCardGold.glb";
                this.damage = 100;
                break;
        }
        this.projectile = new FlammeCardProjectile();
    }

    public firstSpell(_scene : Scene, position : Vector3): void {
        this.projectile.init(_scene, position,this.damage);
    }


    secondSpell(): void {
        console.log('Second spell');
    }

    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    meshname: string;
    rarete: RareteCard;

    setup() {
        // Setup the card
    }


}
