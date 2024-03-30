import {Vector3, Camera, UniversalCamera, Engine, Scene} from "@babylonjs/core";
import {Player} from "./player";
import {OurScene} from "../../scenes";
import {CardList} from "../../../components/GameObjects/Card/CardList";
import {PlayerMovement} from "./playerMovement";

export class FirstPersonPlayer extends Player implements PlayerMovement{
    our_scene: OurScene;
    canvas: HTMLCanvasElement;
    engine: Engine;
    mouseSensitivity: number =  0.0002;
    cardlist: CardList;
    movement_keys = { left: false, right: false, forward: false, back: false,jump: false};

    constructor(our_scene: OurScene){
        const camera: Camera  = new UniversalCamera("FPS", new Vector3(0, 2, 0), our_scene.scene);
        camera.attachControl(our_scene.canvas, true);
        super(our_scene.scene, camera);
        this.our_scene = our_scene;
        this.canvas = our_scene.canvas;
        this.engine = our_scene.engine;
        this.camera = camera;
        this.our_scene.scene.activeCamera = this.camera;
        this.cardlist = new CardList(this.our_scene);
        this.setup();
    }


    setup(){
        this.setupMovement();
    }

    updatePlayerPosition(){
        this.updatePosition(this.movement_keys);
    }

    _setupPointerLock(canvas: HTMLCanvasElement){
        canvas.onclick = function () {
            console.log("canvas.onclick")
            console.log("canvas: ", canvas);
            let requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;
            if (requestPointerLock) {
                console.log("requestPointerLock exists")
                canvas.requestPointerLock = requestPointerLock;
                // Ask the browser to lock the pointer
                canvas.requestPointerLock();
            } else {
                console.log("Pointer lock not supported");
            }
        };
    }
    setupPointerLock() {
        document.addEventListener('pointerlockchange', (event) => this.changeCallback(event),
            false);
        document.addEventListener('mozpointerlockchange', (event) => this.changeCallback(event),
            false);
        document.addEventListener('webkitpointerlockchange', (event) => this.changeCallback(event),
            false);

        // When the element is clicked, request pointer lock
        console.log("setupPointerLock");
        this._setupPointerLock(this.canvas);
    }




    mouseMove(e: MouseEvent): void {
        let deltaTime = this.engine.getDeltaTime();

        let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        this.rotation.x += movementY * deltaTime * this.mouseSensitivity;
        this.rotation.y -= movementX * deltaTime * this.mouseSensitivity;
    }
    handleKeyUp(evt: KeyboardEvent): void {
        if (evt.key == 'q') {
            this.movement_keys.left = false;
        }
        if (evt.key == 'd') {
            this.movement_keys.right = false;
        }
        if (evt.key == 'z') {
            this.movement_keys.forward = false;
        }
        if (evt.key == 's') {
            this.movement_keys.back = false;
        }
        if (evt.key == ' ') {
            this.movement_keys.jump = false;
        }
    }

    handleKeyDown(evt: KeyboardEvent): void {
        console.log(evt.key);
        if (evt.key == 'q') {
            this.movement_keys.left = true;
            console.log('A: ' + this.movement_keys.left);
        }
        if (evt.key == 'd') {
            this.movement_keys.right = true;
            console.log('D: ' + this.movement_keys.right);
        }
        if (evt.key == 'z') {
            this.movement_keys.forward = true;
            console.log('W: ' + this.movement_keys.forward);
        }
        if (evt.key == 's') {
            this.movement_keys.back = true;
            console.log('S: ' + this.movement_keys.back);
        }
        if (evt.key == ' ') {
            this.movement_keys.jump = true;
        }
    }

    setupMovement() {
        window.addEventListener("keydown", (evt) => this.handleKeyDown(evt), false);
        window.addEventListener("keyup", (evt) => this.handleKeyUp(evt), false);
    }

    changeCallback(e: Event) {
        if (
            document.pointerLockElement === this.canvas ||
            document.mozPointerLockElement === this.canvas ||
            document.webkitPointerLockElement === this.canvas
        ) {
            // We've got a pointer lock for our element, add a mouse listener
            console.log("changeCallback activated");
            document.addEventListener("mousemove", (e) => this.mouseMove(e), false);
            document.addEventListener("mousedown", (e) => this.mouseMove(e), false);
            document.addEventListener("mouseup", (e) => this.mouseMove(e), false);
        } else {
            // Pointer lock is no longer active, remove the callback and mouse listener
            console.log("changeCallback deactivated")
            document.removeEventListener("mousemove", (e) => this.mouseMove(e), false);
            document.removeEventListener("mousedown", (e) => this.mouseMove(e), false);
            document.removeEventListener("mouseup", (e) => this.mouseMove(e), false);
        }
    }
}


