/**
 * SceneManager.ts
 * The SceneManager class is used to manage the scenes and Havok physics engine.
 * It also contains the player object.
 */

import {Engine} from "@babylonjs/core";
import {PlayerState} from "../character/players";
import {OlympiadScene} from "./OlympiadScene.ts";

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

    public get assetsLoaded(): boolean {
        if (!this.engine) return false;
        if (this.engine.scenes.length == 0) return false;
        return (this.engine.scenes[0] as OlympiadScene).isSceneReady;
    }

    public get playerReady(): boolean {
        if(!this.assetsLoaded) return false;
        return !!this.engine.scenes[0].activeCamera;
    }

    public startTimer() {
        console.log("Game started before!")
        if (this.assetsLoaded && this.playerReady) {
            let scene = this.engine.scenes[0] as OlympiadScene;
            scene.player.ui.startTimer();
            console.log("Game started!")
        }
    }

    public renderScene() {
        if (!this.engine.scenes[0]) throw new Error("No active scene set.");

        this.engine.runRenderLoop(() => {
            // Render the scene if not stopped
            let scene = this.engine.scenes[0] as OlympiadScene;
            if (!this.assetsLoaded || !this.playerReady) {
                let loopRenderSceneWhenReady = setInterval(() => {
                    if (this.assetsLoaded) {
                        if (this.playerReady) {
                            clearInterval(loopRenderSceneWhenReady);
                            this.engine.scenes[0].render();
                        } else {
                            // console.log("Scene not ready yet: Player loading...")
                        }
                    } else {
                        // console.log("Scene not ready yet: Asset loading...");
                    }
                }, 1000);
            } else {
                scene.render();
            }
        });
    }
}

