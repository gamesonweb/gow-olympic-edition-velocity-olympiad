import {SceneManager} from "./scenes/sceneManager.ts";
import {Engine} from "@babylonjs/core";
import { FirstPersonPlayer } from "./Character/players/firstPersonPlayer.ts";
var keys = { left: false, right: false, forward: false, back: false,jump: false};

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
        SetupPointerLock(this.canvas,this.sceneManager.scenes[0].player);
        // Render the scenes
        //this.sceneManager.renderScenes();
        this.engine.runRenderLoop(() => {
            this.sceneManager.scenes.forEach(scene => {
                scene.scene.render(); // possibilité de changer de scène en appelant une liste de scène de SceneManager au lieu d'un attribut scene
                scene.player.UpdatePlayerPosition(keys);
            });
        });
    }
}

function SetupPointerLock(canvas: HTMLCanvasElement, FFP: FirstPersonPlayer) {
    // Register the callback when a pointer lock event occurs
    document.addEventListener('pointerlockchange', (event) => changeCallback(event, canvas, FFP), false);
    document.addEventListener('mozpointerlockchange', (event) => changeCallback(event, canvas, FFP), false);
    document.addEventListener('webkitpointerlockchange', (event) => changeCallback(event, canvas, FFP), false);

    // When the element is clicked, request pointer lock
    canvas.onclick = function () {
        canvas.requestPointerLock =
            canvas.requestPointerLock ||
            canvas.mozRequestPointerLock ||
            canvas.webkitRequestPointerLock;

        // Ask the browser to lock the pointer
        canvas.requestPointerLock();
    };
}

function changeCallback(event: Event, canvas: HTMLCanvasElement, FFP: FirstPersonPlayer) {
    if (
        document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas ||
        document.webkitPointerLockElement === canvas
    ) {
        // We've got a pointer lock for our element, add a mouse listener
        document.addEventListener("mousemove", (e) => mouseMove(e, FFP), false);
        document.addEventListener("mousedown", (e) => mouseMove(e, FFP), false);
        document.addEventListener("mouseup", (e) => mouseMove(e, FFP), false);
    } else {
        // Pointer lock is no longer active, remove the callback and mouse listener
        document.removeEventListener("mousemove", (e) => mouseMove(e, FFP), false);
        document.removeEventListener("mousedown", (e) => mouseMove(e, FFP), false);
        document.removeEventListener("mouseup", (e) => mouseMove(e, FFP), false);
    }
}

var mouseMove = function (e: MouseEvent, FFP: FirstPersonPlayer) {
    var deltaTime = FFP.engine.getDeltaTime();

    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

    FFP.player.rotation.x += movementY * deltaTime * FFP.mouseSensitivity;
    FFP.player.rotation.y -= movementX * deltaTime * FFP.mouseSensitivity;
};

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);

function handleKeyDown(evt: KeyboardEvent) {
    console.log(evt.key);
    if (evt.key == 'q') {
        keys.left = true;
        console.log('A: ' + keys.left);
    }
    if (evt.key == 'd') {
        keys.right = true;
        console.log('D: ' + keys.right);
    }
    if (evt.key == 'z') {
        keys.forward = true;
        console.log('W: ' + keys.forward);
    }
    if (evt.key == 's') {
        keys.back = true;
        console.log('S: ' + keys.back);
    }
    if (evt.key == ' ') {
        keys.jump = true;
    }
}

function handleKeyUp(evt: KeyboardEvent) {

    if (evt.key == 'q') {
        keys.left = false;
    }
    if (evt.key == 'd') {
        keys.right = false;
    }
    if (evt.key == 'z') {
        keys.forward = false;
    }
    if (evt.key == 's') {
        keys.back = false;
    }
    if (evt.key == ' ') {
        keys.jump = false;
    }
}
