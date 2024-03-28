import {
    Engine,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsImpostor, PhysicsShapeType,
    Vector3
} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";
import {FlammeCard} from "./armes/FlammeCard.ts";
import {CardSocle} from "./CardSocle.ts";


export class TestCard {
    our_scene: any;


    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.our_scene = new OurScene(engine, canvas, physicsEngine);

        // ajout de la carte flamme
        const flamespell = new FlammeCard();
        //  construction de la carte
        const flammeCard = new CardSocle(this.our_scene.scene, engine, flamespell, new Vector3(0, 20, 0));
        flammeCard.setup();

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.our_scene.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.our_scene.scene);

    }

    setup() {
        // Setup the temple
    }
}