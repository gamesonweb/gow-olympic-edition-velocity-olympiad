import {OurScene} from "../../scenes";
import {
    Engine,
    FreeCamera,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate, PhysicsShapeType,
    Vector3
} from "@babylonjs/core";
import {MeleeEnemy} from "../../Character/Enemy/melee.ts";

export class WelcomeLevel {
    ourScene: OurScene
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.ourScene = new OurScene(engine, canvas, physicsEngine);
        this.setup();
    }

    setup() {
        // Set up the welcome level

        let camera = new FreeCamera('camera', new Vector3(0, 5, 10), this.ourScene.scene);
        camera.attachControl(this.ourScene.canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.ourScene.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.ourScene.scene);

    //     add and MeleeEnemy
        const meleeEnemy = new MeleeEnemy(this.ourScene.scene, new Vector3(0, 10, 0));
        meleeEnemy.setupCharacter();


    }
}
