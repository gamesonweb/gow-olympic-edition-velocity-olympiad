/**
 * OlympiadScene is equivalent to OurScene in the first version of the project.
 */

import {Scene, Engine, SceneOptions, Vector3, HavokPlugin,PhysicsViewer} from '@babylonjs/core';
import * as GUI from "@babylonjs/gui";
import {SceneComponent} from "./SceneComponent";
import HavokPhysics from "@babylonjs/havok";
import {PlayerState} from "../character/players/PlayerState";
import { Inspector } from '@babylonjs/inspector';
import {FirstPersonPlayer} from "../character/players/FirstPersonPlayer";
import {Player} from "../character/players";


export class OlympiadScene extends Scene {

    private _sceneComponents: SceneComponent[] = [];
    protected engine: Engine;
    protected physicsEngine: HavokPlugin;
    protected readonly player: Player;
    protected guiStackPanel: GUI.StackPanel;

    protected constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options);
        this.engine = engine;
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
        this._createGUI();
    }

    private _createGUI() {
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.guiStackPanel = new GUI.StackPanel();
        this.guiStackPanel.width = "220px";
        this.guiStackPanel.isVertical = true;
        this.guiStackPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.guiStackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(this.guiStackPanel);
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
            Inspector.Show(this, {embedMode: true});
            this.debugLayer.show();
            var viewer = new PhysicsViewer(this);
            this.meshes.forEach((mesh) => {
                if (mesh.physicsBody) {
                    viewer.showBody(mesh.physicsBody);
                }
            });
        }
    }

    public render(updateCameras?: boolean, ignoreAnimations?: boolean) {
        this.player.updatePosition();
        super.render(updateCameras, ignoreAnimations);
    }
}
