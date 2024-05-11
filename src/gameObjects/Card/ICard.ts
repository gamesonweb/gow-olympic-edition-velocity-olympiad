import {RareteCard} from "./RareteCard.ts";
import {Character} from "../../character/interfaces/Character.ts";
import {Player} from "../../character/players";



export interface ICard {
    firstSpell(player:Player): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;

    setup(): void;
}