import {ICard} from "../ICard.ts";
import {RareteCard} from "../RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

import {Player} from "../../../character/players/index.ts";
import {OlympiadScene} from "../../../scenes/OlympiadScene.ts";

export class JumpCard implements ICard {

    public damage: number;
    public durabilite: number;
    name: string = 'Jump';
    description: string = 'Une carte de Saut';
    meshname: string;
    rarete: RareteCard;

    constructor(rarete: RareteCard) {
        this.rarete = rarete;
        switch (rarete) {
            case RareteCard.COMMON:
                this.meshname = "BootCardGray.glb";
                this.damage = 10;
                this.durabilite = 1;
                break;
            case RareteCard.RARE:
                this.meshname = "BootCardBlue.glb"
                this.damage = 20;
                this.durabilite = 2;
                break;
            case RareteCard.EPIC:
                this.meshname = "BootCardPurple.glb";
                this.damage = 30;
                this.durabilite = 3;
                break;
            case RareteCard.LEGENDARY:
                this.meshname = "BootCardGold.glb";
                this.damage = 40;
                this.durabilite = 5;
                break;
        }
    }

    public firstSpell(_scene: Scene, position: Vector3): void {
        let olympiadScene: OlympiadScene = <OlympiadScene>_scene;
        let _player: Player = olympiadScene.player;
        _player._increaseSpeedCap(this.damage);
        setTimeout(() => {
            _player._returnToNormalSpeedCap();
        }, 10000);
    }

    public secondSpell(_scene: Scene, position: Vector3): void {
        let olympiadScene: OlympiadScene = <OlympiadScene>_scene;
        let _player: Player = olympiadScene.player;
        _player._superJump();
        this.durabilite--;
    }

    setup() {
        // Setup the card
    }


}
