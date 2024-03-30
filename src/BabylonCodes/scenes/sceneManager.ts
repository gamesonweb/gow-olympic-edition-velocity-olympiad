import {
    Engine,
} from '@babylonjs/core';

import { OurScene } from "./ourScene";

export class SceneManager {
    // Manage the scenes and Havok physics engine
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
    }

    addScene(scene: OurScene){
        if(!scene.isSceneSetup) scene.setupScene();
        this.scenes.push(scene);
    }

    renderScenes(){
        // SetupPointerLock(this.canvas,this.scenes[0].player);
        this.scenes[0].player.setupPointerLock();
        this.engine.runRenderLoop(() => {
            this.scenes.forEach(ourScene => {
                ourScene.scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
                ourScene.player.updatePlayerPosition();
            });
        });
    }
}






