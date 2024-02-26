import {OurScene} from "../../../BabylonCodes/scenes";
import {SceneManager} from "../../../BabylonCodes/scenes/sceneManager";
import {Engine, HavokPlugin} from "@babylonjs/core";
import {Temple} from "./temple";

export class TestTemple {
    our_scene: any;
    temple: Temple

    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.our_scene = new OurScene(engine, canvas, physicsEngine);
        this.temple = new Temple(this.our_scene);
    }

    setup() {
        // Setup the temple
    }
}
