import {SceneManager} from "./SceneManager.ts";
import {Engine} from "@babylonjs/core";


export class Main{
    canvas: HTMLCanvasElement;
    engine: Engine;
    sceneManager: SceneManager;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true);
        this.sceneManager = new SceneManager(this.engine, this.canvas);
    }
    
    async Init(){
        await this.sceneManager.createPhysicsEngine();
        return;
    }

    CreateScene(){
        this.sceneManager.createScene();
    }

    Run(){
        this.engine.runRenderLoop(()=>{
            this.sceneManager.scenes[0].scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
        });
    }
}