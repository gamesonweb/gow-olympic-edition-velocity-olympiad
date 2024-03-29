import {
    Engine,
    HavokPlugin,
} from '@babylonjs/core';

import { OurScene } from "./ourScene";
import {TestCard} from "../../components/GameObjects/Card/TestCard.ts";

export class SceneManager {
    // Manage the scenes and Havok physics engine
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
    }

    addScene(scene: TestCard){
        if(!scene.isSceneSetup) scene.setupScene();
        this.scenes.push(scene);
    }
}




