import { Scene, Engine , FreeCamera , Vector3} from "@babylonjs/core";

export class BasicScene{

    scene: Scene;
    engine: Engine;

    constructor(canvas: HTMLCanvasElement){
        this.engine = new Engine(canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        });
    }

    CreateScene():Scene{
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

        return scene;
    }

}