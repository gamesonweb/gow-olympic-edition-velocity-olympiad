import {RareteCard} from "./RareteCard.ts";
import {CardList} from "./CardList.ts";
import {FirstPersonPlayer} from "../../../BabylonCodes/Character/players/firstPersonPlayer.ts";


export interface ICard {
    firstSpell(FirstPersonPlayer : FirstPersonPlayer): void;
    secondSpell(): void;
    name: string;
    description: string;
    meshname: any;
    rarete: RareteCard;

    setup(): void;
}