import {Engine, Scene, Vector3} from "@babylonjs/core";
import {ICard} from "./ICard.ts";


export class CardSocle {
    position: Vector3;
    scene: Scene;
    engine: Engine;
    card : ICard;

    constructor(scene: Scene, engine: Engine, card: ICard,position: Vector3) {
        this.scene = scene;
        this.engine = engine;
        this.card = card;
        this.position = position;
    }

    setup() {
        // Setup the socle
    }

    firstSpell() {
        this.card.firstSpell();
    }

    secondSpell() {
        this.card.secondSpell();
    }

    getCardName() {
        return this.card.name;
    }

    getCardDescription() {
        return this.card.description;
    }

    getCardMesh() {
        return this.card.mesh;
    }

    getCard() {
        return this.card;
    }

    setCard(card: ICard) {
        this.card = card;
    }

    setPosition(position: Vector3) {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }



}