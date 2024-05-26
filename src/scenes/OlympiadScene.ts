/**
 * OlympiadScene is equivalent to OurScene in the first version of the project.
 */

import {Engine, HavokPlugin, Scene, SceneOptions, Vector3} from '@babylonjs/core';
import {SceneComponent} from "./SceneComponent";
import HavokPhysics from "@babylonjs/havok";
import {Player} from "../character/players";
import {Inspector} from '@babylonjs/inspector';


export class OlympiadScene extends Scene {

    private _sceneComponents: SceneComponent[] = [];
    private _gameObjects: GameObject[] = [];
    protected engine: Engine;
    protected physicsEngine!: HavokPlugin;
    public player!: Player;

    protected constructor(engine: Engine, options?: SceneOptions) {
        super(engine, options);
        this.engine = engine;
        this._enableDebug();
        this.onBeforeRenderObservable.add(() => {
            this._gameObjects.forEach((gameObject) => {
                if (gameObject && gameObject.canDetectCollision) {
                    gameObject.detectCollision(this._gameObjects);
                }
                gameObject.updateState();

            });
        });
    }

    public get gameObjects(): GameObject[] {
        return this._gameObjects;
    }

    public get sceneComponents(): SceneComponent[] {
        return this._sceneComponents;
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

    private _enableDebug(): void {
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            Inspector.Show(this, {embedMode: true});
            // this.debugLayer.show();
            // var viewer = new PhysicsViewer(this);
            // this.meshes.forEach((mesh) => {
            //     if (mesh.physicsBody) {
            //         viewer.showBody(mesh.physicsBody);
            //     }
            // });
        }
    }

    public render(updateCameras?: boolean, ignoreAnimations?: boolean) {
        super.render(updateCameras, ignoreAnimations);
    }
}
