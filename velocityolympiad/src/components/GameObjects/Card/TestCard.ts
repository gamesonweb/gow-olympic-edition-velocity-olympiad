import {
    Engine,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Vector3
} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";
import {FlammeCard} from "./armes/FlammeCard.ts";
import {CardSocle} from "./CardSocle.ts";
import {RareteCard} from "./RareteCard.ts";


export class TestCard {
    our_scene: any;


    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.our_scene = new OurScene(engine, canvas, physicsEngine);

        // ajout de la carte flamme
        const commonFlammeCard = new FlammeCard(RareteCard.COMMON);
        const socle = new CardSocle(this.our_scene.scene, engine, commonFlammeCard, new Vector3(10, 0, 0));

        const rareFlammeCard = new FlammeCard(RareteCard.RARE);
        const socle2 = new CardSocle(this.our_scene.scene, engine, rareFlammeCard, new Vector3(10, 0, 5));

        const epicFlammeCard = new FlammeCard(RareteCard.EPIC);
        const socle3 = new CardSocle(this.our_scene.scene, engine, epicFlammeCard, new Vector3(10, 0, 10));

        const legendaryFlammeCard = new FlammeCard(RareteCard.LEGENDARY);
        const socle4 = new CardSocle(this.our_scene.scene, engine, legendaryFlammeCard, new Vector3(10, 0, 15));


        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.our_scene.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.our_scene.scene);

    }

    setup() {

    }
}