import {
    Engine,
    ISceneLoaderPlugin,
    ISceneLoaderPluginAsync, Nullable,
    PhysicsImpostor,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {ICard} from "./ICard.ts";


export class CardSocle {
    position: Vector3;
    scene: Scene;
    engine: Engine;
    card : ICard;
    private mesh: Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>;

    constructor(scene: Scene, engine: Engine, card: ICard,position: Vector3) {
        this.scene = scene;
        this.engine = engine;
        this.card = card;
        this.position = position;
        this.setup();

    }

    setup() {
        // Setup the socle
        SceneLoader.ImportMesh("", "./models/", "TorchCard.glb", this.scene, (meshes) => {
            console.log(meshes);
        });
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