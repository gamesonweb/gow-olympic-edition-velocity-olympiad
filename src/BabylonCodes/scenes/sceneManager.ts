import {
    Engine,
    HavokPlugin,
} from '@babylonjs/core';
import { SetupPointerLock, handleKeyUp, handleKeyDown, mouseMove, changeCallback, keys } from "./utils"

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
        SetupPointerLock(this.canvas,this.scenes[0].player);
        this.engine.runRenderLoop(() => {
            this.scenes.forEach(scene => {
                scene.scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
                scene.player.UpdatePlayerPosition(keys);
            });
        });
    }
}






