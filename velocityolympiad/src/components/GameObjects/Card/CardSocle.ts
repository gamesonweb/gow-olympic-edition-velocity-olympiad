import {
    Engine,
    ISceneLoaderPlugin,
    ISceneLoaderPluginAsync, Nullable,
    PhysicsImpostor,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
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
        this.mesh = SceneLoader.ImportMesh("", "assets/", this.card.mesh, this.scene, function (meshes) {
            meshes[0].position = this.position;
            meshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
            meshes[0].physicsImpostor = new PhysicsImpostor(meshes[0], PhysicsImpostor.BoxImpostor, {mass: 1}, this.scene);
        }
        );

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