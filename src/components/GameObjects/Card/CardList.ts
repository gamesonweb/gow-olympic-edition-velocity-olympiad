import {OurScene} from "../../../BabylonCodes/scenes";
import {ICard} from "./ICard";

export class CardList extends Array {
    ourScene: OurScene;
    constructor(ourScene: OurScene) {
        super();
        this.ourScene = ourScene;
    }

    push(...items: ICard[]) {
        // Appel de la méthode push() originale de Array
        const result = super.push(...items);
        this.ourScene.updateGUI();
        return result;
    }

    // Méthode pour déclencher une action à chaque modification de la cardlist

    getCurrentCard() {
        if (this.length === 0) return null;

        return this[this.length - 1];
    }

    nextCard() {


        this.ourScene.updateGUI();
        if (this.length == 0) return null;
        this.pop();
        this.ourScene.updateGUI();

    }
}


