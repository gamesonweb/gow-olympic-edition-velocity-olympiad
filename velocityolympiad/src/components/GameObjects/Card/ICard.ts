import {RareteCard} from "./RareteCard.ts";


export interface ICard {
    firstSpell(): void;
    secondSpell(): void;
    name: string;
    description: string;
    mesh: any;
    rarete: RareteCard;

}