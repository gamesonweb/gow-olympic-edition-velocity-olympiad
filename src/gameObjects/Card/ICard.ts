import {RareteCard} from "./RareteCard.ts";
import {Character} from "../../character/interfaces/Character.ts";
import {Player} from "../../character/players";
import {Scene, Vector3} from "@babylonjs/core";



export interface ICard {
    firstSpell(scene : Scene, position : Vector3): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;

    setup(): void;
}