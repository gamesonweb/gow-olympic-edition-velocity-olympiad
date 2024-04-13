import {OurScene} from "../../../BabylonCodes/scenes";
import * as GUI from "@babylonjs/gui";
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
        // Action à déclencher à chaque ajout
        this.onCardListPush(...items);
        return result;
    }

    // Méthode pour déclencher une action à chaque modification de la cardlist
    onCardListPush(...items: ICard[]) {
        console.log("Une action a été déclenchée suite à une modification de la cardlist.");
        // Mettez ici votre code d'action
        for (const item of items) {
            const button = GUI.Button.CreateSimpleButton("but", item.name);
            button.width = "100px"
            button.height = "50px";
            button.color = "white";
            button.background = "green";
            button.onPointerUpObservable.add(function () {
                console.log("clicked");
            });
            this.ourScene.stackPanel.addControl(button);
        }
    }

    getCurrentCard() {
        if (this.length === 0) return null;

        return this[this.length - 1];
    }

    nextCard() {
        if (this.length === 0) return null;
        this.pop();
    }
}


