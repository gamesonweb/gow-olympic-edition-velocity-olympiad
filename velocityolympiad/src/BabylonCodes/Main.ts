import { Engine } from "@babylonjs/core";
import { SceneManager } from "@/BabylonCodes/SceneManager";

export class Main{
    canvas: HTMLCanvasElement;
    engine: Engine;
    sceneManager: SceneManager;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true);
        this.sceneManager = new SceneManager(this.engine, this.canvas);
    }

    Run(){
        this.engine.runRenderLoop(()=>{
            this.sceneManager.scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
        });
    }
}