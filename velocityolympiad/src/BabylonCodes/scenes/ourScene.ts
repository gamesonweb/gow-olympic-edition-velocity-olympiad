import {
    Engine,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    Vector3
} from "@babylonjs/core";
import {FirstPersonPlayer} from "../players/firstPersonPlayer";
import {Inspector} from "@babylonjs/inspector";
import {Debug} from "@babylonjs/core/Legacy/legacy";

export class OurScene {
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    isSceneSetup: boolean = false;
    canvas: HTMLCanvasElement;

    constructor(engine: Engine,
                canvas: HTMLCanvasElement,
                physicsEngine: HavokPlugin
    ){
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = physicsEngine;
        this.setupScene();
    }


    setupScene(scene: Scene = undefined){
        if (this.isSceneSetup) return;
        if (scene === undefined) this.scene = this._createScene();
        else this.scene = scene;
        // Add the player to the scene, etc ... for inherited classes

        // show the inspector in DEV mode
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            Inspector.Show(this.scene, {enablePopup: false});
            new Debug.AxesViewer(this.scene, 10);
        }
        this.isSceneSetup = true;
    }

    _createScene(enablePhysics: boolean = true): Scene{
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        if(enablePhysics) scene.enablePhysics(gravity, this.physicsEngine);
        return scene;
    }
}
