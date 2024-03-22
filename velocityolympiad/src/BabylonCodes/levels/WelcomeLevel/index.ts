import {OurScene} from "../../scenes";
import {ArcRotateCamera, Camera, Engine, HavokPlugin, Vector3} from "@babylonjs/core";
import {Temple} from "../../../components/GameObjects/Temple";

export class WelcomeLevel {
    ourScene: OurScene
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.ourScene = new OurScene(engine, canvas, physicsEngine);
        this.setup();
    }

    setup() {
        // Set up the welcome level

        // create a player

        let camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10,
            new Vector3(0, 0, 0), this.ourScene.scene);
        camera.attachControl(this.ourScene.canvas, true);
        let temple = new Temple(this.ourScene, 1, 15, 7, camera);



    }
}
