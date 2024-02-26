import {
    Engine,
    HavokPlugin,
} from '@babylonjs/core';

import HavokPhysics from "@babylonjs/havok";
import { OurScene } from "./scenes/ourScene";
import { FirstLevel } from "./scenes/firstLevel";

export class SceneManager {
    // Manage the scenes and Havok physics engine
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;
    physicsEngine: HavokPlugin | undefined;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = undefined;
    }

    async createPhysicsEngine() {
        this.physicsEngine = new HavokPlugin(true, await HavokPhysics());
    }

    createScene(isEmptyScene: boolean = false){
        if (this.physicsEngine === undefined){
            throw new Error("Physics engine not created");
        } else {
            if (isEmptyScene) this.scenes.push(new OurScene(this.engine,this.canvas,this.physicsEngine, isEmptyScene));
            this.scenes.push(new FirstLevel(this.engine,this.canvas,this.physicsEngine));
        }
    }

    addScene(scene: OurScene){
        if (this.physicsEngine === undefined){
            throw new Error("Physics engine not created");
        } else {
            scene.setupScene();
            this.scenes.push(scene);
        }
    }
}




