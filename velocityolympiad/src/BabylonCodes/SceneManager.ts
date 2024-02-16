import {Engine, Scene} from '@babylonjs/core';

export class SceneManager{
    scene: Scene;
    engine: Engine;

    constructor(engine: Engine, canvas: HTMLCanvasElement){
        this.engine = engine;
        this.scene = this.CreateScene();
        this.engine.runRenderLoop(()=>{
            this.scene.render();
        });
    }

    CreateScene():Scene{
        const scene = new Scene(this.engine);
        return scene;
    }
}