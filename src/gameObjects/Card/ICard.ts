import {RareteCard} from "./RareteCard.ts";



export interface ICard {
    firstSpell(): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;

    setup(): void;
}