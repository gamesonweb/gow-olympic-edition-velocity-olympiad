import {RareteCard} from "./RareteCard.ts";
import {Character} from "../../character/interfaces/Character.ts";



export interface ICard {
    firstSpell(player:Character): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;

    setup(): void;
}