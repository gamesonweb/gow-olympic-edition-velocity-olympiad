/**
 * SceneManager.ts
 * The SceneManager class is used to manage the scenes and Havok physics engine.
 * It also contains the player object.
 */

import {Engine, HavokPlugin, Scene} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {PlayerState} from "../character/players";
import * as GUI from "@babylonjs/gui";
import {WelcomeScene} from "../scenes/WelcomeScene";

export class SceneManager {

    // Manage the scenes and Havok physics engine

    private readonly _canvas: HTMLCanvasElement;
    public engine: Engine;
    public playerState: PlayerState;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.engine = new Engine(this._canvas, true);
        this.playerState = new PlayerState();
    }

    public renderScene() {
        if (!this.engine.scenes[0]) throw new Error("No active scene set.");
        this.engine.runRenderLoop(() => {
            this.engine.scenes[0].render();
        });
    }
}

