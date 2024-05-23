import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

import {FlammeCardProjectile} from "./FlammeCardProjectile.ts";
import {Player} from "../../../character/players";

export class FlammeCard implements ICard {

    public projectile!: FlammeCardProjectile;
    public damage: number;
    public durabilite: number;

    constructor(rarete: RareteCard) {
        this.rarete = rarete;
        switch (rarete) {
            case RareteCard.COMMON:
                this.meshname = "TorchCardGray.glb";
                this.damage = 10;
                this.durabilite = 1;
                break;
            case RareteCard.RARE:
                this.meshname = "TorchCardBlue.glb"
                this.damage = 20;
                this.durabilite = 2;
                break;
            case RareteCard.EPIC:
                this.meshname = "TorchCardPurple.glb";
                this.damage = 50;
                this.durabilite = 3;
                break;
            case RareteCard.LEGENDARY:
                this.meshname = "TorchCardGold.glb";
                this.damage = 100;
                this.durabilite = 5;
                break;
        }
        this.projectile = new FlammeCardProjectile();
    }

    public firstSpell(_scene : Scene, position : Vector3): void {
        this.projectile.init(_scene, position,this.damage);
    }

    public secondSpell(_player: Player): void {
        _player._dash()
        this.durabilite -= 1;

    }

    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    meshname: string;
    rarete: RareteCard;

    setup() {
        // Setup the card
    }


}
