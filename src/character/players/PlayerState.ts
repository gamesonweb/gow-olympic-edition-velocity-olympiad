/**
 * PlayerState contains the cardlist of the player and any information about the player independent of the scene.
 * The active scene is can be access and manage as well.
 */
import {CardList} from '../../gameObjects/Card/CardList';

export class PlayerState {
    cardList: CardList | null = null;

    constructor(cardList?: CardList) {
        if (cardList === null) {
            cardList = new CardList();
        }
        this.cardList = cardList;
    }
}

