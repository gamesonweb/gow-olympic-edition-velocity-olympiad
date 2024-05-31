/**
 * OlympiadScene is equivalent to OurScene in the first version of the project.
 */

import {Engine, HavokPlugin, Scene, SceneOptions, Vector3} from '@babylonjs/core';
import {SceneComponent} from "./SceneComponent";
import HavokPhysics from "@babylonjs/havok";
import {Player} from "../character/players";
import {EnemyManager} from "./EnemyManager.ts";


export class OlympiadScene extends Scene {

    public player!: Player;
    protected engine: Engine;
    protected physicsEngine!: HavokPlugin;
    protected enemyManager!: EnemyManager;
    public modelsLoaded: { [key: string]: boolean } = {};

    protected constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options);
        this.engine = engine;
        this._enableDebug();
    }

    private _sceneComponents: SceneComponent[] = [];

    public get sceneComponents(): SceneComponent[] {
        return this._sceneComponents;
    }

    private _gameObjects: GameObject[] = [];

    public get gameObjects(): GameObject[] {
        return this._gameObjects;
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
        // this._createGUI();
        this.collisionsEnabled = true;
        this.onBeforeRenderObservable.add(() => {
            // all element is modelLoaded == true
            let sceneReady: boolean = true;
            for (let key in this.modelsLoaded) {
                if (!this.modelsLoaded[key]) {
                    sceneReady = false;
                    break;
                }
            }
            // console.log("sceneReady", sceneReady);
            // console.log("modelsLoaded", this.modelsLoaded);
            this._gameObjects.forEach((gameObject) => {
                if (gameObject && gameObject.canDetectCollision) {
                    gameObject.detectCollision(this._gameObjects);
                }
                if (sceneReady) gameObject.updateState();
            });
        });
    }

    // private _createGUI() {
    //     const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    //     this.guiStackPanel = new GUI.StackPanel();
    //     this.guiStackPanel.width = "220px";
    //     this.guiStackPanel.isVertical = true;
    //     this.guiStackPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    //     this.guiStackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    //     advancedTexture.addControl(this.guiStackPanel);
    // }

    public destroy(): void {
        this._sceneComponents.forEach((component) => {
            if (component) {
                component.destroy()
            }
        });
        this._sceneComponents = [];
        this.dispose();
    }

    public addComponent(component: SceneComponent): void {
        this._sceneComponents.push(component);
    }

    public addGameObject(gameObject: GameObject): void {
        this._gameObjects.push(gameObject);
    }

    public render(updateCameras?: boolean, ignoreAnimations?: boolean) {
        super.render(updateCameras, ignoreAnimations);
    }

    public restart() {
        throw new Error("Method not implemented yet.");
    }

    public onPauseState() {
        throw new Error("Method not implemented yet.");
    }

    public onResumeState() {
        throw new Error("Method not implemented yet.");
    }

    private _enableDebug(): void {
        if (import.meta.env.DEV) {
            // Inspector.Show(this, {embedMode: true});
            // this.debugLayer.show();
            // var viewer = new PhysicsViewer(this);
            // this.meshes.forEach((mesh) => {
            //     if (mesh.physicsBody) {
            //         viewer.showBody(mesh.physicsBody);
            //     }
            // });
        }
    }
}
