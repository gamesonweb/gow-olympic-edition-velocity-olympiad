import {RareteCard} from "./RareteCard.ts";
import {Scene, Vector3} from "@babylonjs/core";
import {Player} from "../../character/players";

export interface ICard {
    firstSpell(scene : Scene, position : Vector3): void;
    secondSpell(_player : Player): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;
    damage: number;
    durabilite: number;

    setup(): void;
}
