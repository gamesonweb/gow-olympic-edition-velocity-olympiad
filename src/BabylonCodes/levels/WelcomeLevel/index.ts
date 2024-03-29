import {OurScene} from "../../scenes";
import {
    ArcRotateCamera, Color3,
    Engine,
    FreeCamera,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder, PhysicsAggregate, PhysicsShapeType,
    StandardMaterial, Texture,
    Vector3
} from "@babylonjs/core";
import {MeleeEnemy} from "../../Character/Enemy/melee.ts";
import {Temple} from "../../../components/GameObjects/Temple";
import {FlammeCard} from "../../../components/GameObjects/Card/armes/FlammeCard";
import {RareteCard} from "../../../components/GameObjects/Card/RareteCard";
import {CardSocle} from "../../../components/GameObjects/Card/CardSocle";

export class WelcomeLevel {
    ourScene: OurScene
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.ourScene = new OurScene(engine, canvas, physicsEngine);
        this.setup();
    }

    setup() {
        // Set up the welcome level

        let temple = new Temple(this.ourScene, 1, 15, 7);
        temple.position = new Vector3(5, 0, -15);
        temple.rotation = new Vector3(0, Math.PI / 2, 0);
        temple.setup();


        new CardSocle(this.ourScene, new FlammeCard(RareteCard.COMMON), new Vector3(10, 0, 0));
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.RARE), new Vector3(15, 0, 10));
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.EPIC), new Vector3(20, 0, 15));
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.LEGENDARY), new Vector3(25, 0, 5));

        new HemisphericLight("light", new Vector3(0, 1, 0), this.ourScene.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.ourScene.scene);
    }
}
