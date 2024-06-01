import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

import {FlammeCardProjectile} from "./FlammeCardProjectile.ts";
import {Player} from "../../../character/players";
import {OlympiadScene} from "../../../scenes/OlympiadScene.ts";
import {PublicAssetsModel} from "../../../publicAssets/PublicAssetsModel.ts";

export class FlammeCard implements ICard {

    public projectile!: FlammeCardProjectile;
    public damage: number;
    public durabilite: number;
    name: string = 'Flamme';
    description: string = 'Une carte de flamme';
    meshname: string;
    rarete: RareteCard;

    constructor(rarete: RareteCard) {
        this.rarete = rarete;
        switch (rarete) {
            case RareteCard.COMMON:
                this.meshname = PublicAssetsModel.TorchCardGray;
                this.damage = 10;
                this.durabilite = 1;
                break;
            case RareteCard.RARE:
                this.meshname = PublicAssetsModel.TorchCardBlue;
                this.damage = 20;
                this.durabilite = 2;
                break;
            case RareteCard.EPIC:
                this.meshname = PublicAssetsModel.TorchCardPurple;
                this.damage = 50;
                this.durabilite = 3;
                break;
            case RareteCard.LEGENDARY:
                this.meshname = PublicAssetsModel.TorchCardGold;
                this.damage = 100;
                this.durabilite = 5;
                break;
        }
        this.projectile = new FlammeCardProjectile();
    }

    public firstSpell(_scene: Scene, position: Vector3): void {
        this.projectile.init(_scene, position, this.damage);
        (<OlympiadScene>_scene).gameObjects.push(this.projectile);
    }

    public secondSpell(_scene: Scene, position: Vector3): void {
        position;
        let olympiadScene: OlympiadScene = <OlympiadScene>_scene;
        let _player: Player = olympiadScene.player;
        _player._dash()
        this.durabilite -= 1;
    }

    setup() {
        // Setup the card
    }


}
