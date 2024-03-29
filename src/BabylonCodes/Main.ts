import {SceneManager} from "./scenes/sceneManager.ts";
import {Engine} from "@babylonjs/core";
import { FirstPersonPlayer } from "./Character/players/firstPersonPlayer.ts";

import {HavokPlugin} from "@babylonjs/core";
import {OurScene} from "./scenes/ourScene.ts";
import HavokPhysics from "@babylonjs/havok";

export class Main {
    canvas: HTMLCanvasElement;
    engine: Engine;
    physicsEngine: HavokPlugin;
    sceneManager: SceneManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true);
        this.sceneManager = new SceneManager(this.engine, this.canvas);
    }

    getEngine() : Engine {
        return this.engine;
    }

    getCanvas() : HTMLCanvasElement {
        return this.canvas;
    }

    getPhysicsEngine() : HavokPlugin {
        if (this.physicsEngine === undefined) {
            throw new Error("Physics engine not created");
        }
        return this.physicsEngine;
    }

    getSceneManager() : SceneManager {
        return this.sceneManager;
    }

    async _createPhysicsEngine() {
        this.physicsEngine = new HavokPlugin(true, await HavokPhysics());
    }

    async Init() {
        // Create the physics engine
        await this._createPhysicsEngine();
        return;
    }

    Run() {
        // Render the scenes
        this.sceneManager.renderScenes();
    }
}
