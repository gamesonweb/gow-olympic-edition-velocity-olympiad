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

    renderScenes(){
        this.engine.runRenderLoop(() => {
            this.scenes.forEach(scene => {
                scene.scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
                scene.player.UpdatePlayerPosition(scene.player.keys);
            });
        });
    }
}




