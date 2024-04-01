/**
 * OlympiadScene is equivalent to OurScene in the first version of the project.
 */

import {Scene, Engine, SceneOptions, Vector3, HavokPlugin} from '@babylonjs/core';
import * as GUI from "@babylonjs/gui";
import {SceneComponent} from "./SceneComponent";
import HavokPhysics from "@babylonjs/havok";
import {PlayerState} from "../character/players/PlayerState";


export class OlympiadScene extends Scene {

    private _sceneComponents: SceneComponent[] = [];
    protected engine: Engine;
    protected physicsEngine: HavokPlugin;
    protected playerState: PlayerState;
    protected guiStackPanel: GUI.StackPanel;

    protected constructor(engine: Engine, playerState: PlayerState,
                          guiStackPanel: GUI.StackPanel, options?: SceneOptions) {
        super(engine, options);
        this.engine = engine;
        this.playerState = playerState;
        this.guiStackPanel = guiStackPanel;
        this._enableDebug();

    }

    async _createPhysicsEngine() {
        this.physicsEngine = new HavokPlugin(true, await HavokPhysics());
        this.enablePhysics(new Vector3(0, -9.81, 0), this.physicsEngine);
    }

    public async init(): Promise<void> {
        await this.whenReadyAsync();
        window.addEventListener("resize", () => {
            this.getEngine().resize();
        });
        await this._createPhysicsEngine();
    }

    public destroy(): void {
        this._sceneComponents.forEach((component) => component.destroy());
        this._sceneComponents = [];
        this.dispose();
    }

    public addComponent(component: SceneComponent): void {
        this._sceneComponents.push(component);
    }

    private _enableDebug(): void {
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            // this.debugLayer.show();
            // Inspector.Show(this, {enablePopup: false});
            // new Debug.AxesViewer(this, 10);
        }
    }
}
