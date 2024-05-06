/**
 * PlayerState contains the cardlist of the player and any information about the player independent of the scene.
 * The active scene is can be access and manage as well.
 */
import {CardList} from '../../gameObjects/Card/CardList';
import {Mesh} from "@babylonjs/core";

export class State {
    public cardList: CardList | null = null;

    constructor(cardList?: CardList) {
        if (!cardList) {
            cardList = new CardList();
        }
        this.cardList = <CardList>cardList;
    }
}

