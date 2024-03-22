import {OurScene} from "../../../BabylonCodes/scenes";
import {SceneManager} from "../../../BabylonCodes/scenes/sceneManager";
import {Engine, HavokPlugin, MeshBuilder} from "@babylonjs/core";
import {Temple} from "./index";

export class TestTemple {
    our_scene: any;
    temple: Temple

    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.our_scene = new OurScene(engine, canvas, physicsEngine);
        this.temple = new Temple(this.our_scene, 1, 10, 5);
        const ground = MeshBuilder.CreateGround('ground', {width: 50, height: 50}, this.our_scene.scene);

    }

    setup() {
        // Setup the temple
    }
}
