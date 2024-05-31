import {RareteCard} from "./RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

export interface ICard {
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;
    damage: number;
    durabilite: number;

    firstSpell(scene: Scene, position: Vector3): void;

    secondSpell(scene: Scene, position: Vector3): void;

    setup(): void;
}
