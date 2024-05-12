import {RareteCard} from "./RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";

export interface ICard {
    firstSpell(scene : Scene, position : Vector3): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;
    damage: number;

    setup(): void;
}
