/**
 * SceneManager.ts
 * The SceneManager class is used to manage the scenes and Havok physics engine.
 * It also contains the player object.
 */

import {Engine} from "@babylonjs/core";
import {PlayerState} from "../character/players";

export class SceneManager {

    // Manage the scenes and Havok physics engine

    public engine: Engine;
    public playerState: PlayerState;
    private readonly _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.engine = new Engine(this._canvas, true);
        this.playerState = new PlayerState();
    }

    public renderScene() {
        if (!this.engine.scenes[0]) throw new Error("No active scene set.");

        this.engine.runRenderLoop(() => {
            // Render the scene if not stopped
            this.engine.scenes[0].render();
        });
    }
}

