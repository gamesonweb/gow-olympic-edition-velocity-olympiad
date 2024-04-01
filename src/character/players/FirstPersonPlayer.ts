/**
 * Character interface
 * Crete the structure of the character
 * camera: Camera
 * attach came to the character
 */

import { Player} from "./index";
import { PlayerState } from "./PlayerState";
import {
    Scene,
    Mesh,
    UniversalCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Color3, PhysicsAggregate, PhysicsShapeType, TransformNode, Axis, Material
} from "@babylonjs/core";

export class FirstPersonPlayer extends Player {
    private _meshes: Mesh[] = [];
    private camera: UniversalCamera;
    private light: HemisphericLight;
    private mouseSensitivity: number =  0.0002;
    private movement_keys = { left: false, right: false, forward: false, back: false, jump: false };
    private _materials: Material[] = [];

    constructor(playerState: PlayerState, scene: Scene){
        super(playerState, scene);
        this.playerState = playerState;
    }

    get cardList() {
        return this.playerState.cardList;
    }

   set cardList(cardList) {
        this.playerState.cardList = cardList;
   }

    public init(){
        console.log("scene: ", this.scene)
        super.init();
        this._createMesh();
        this._createCamera();
        this._createLight();
        this.position = new Vector3(0, 100, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.playerNode = new TransformNode("player", this.scene);
        this.aggregate = new PhysicsAggregate(<Mesh>this.mesh, PhysicsShapeType.BOX, { mass: 1, friction: 0.5,
            restitution: 0.1 }, this.scene);
        this.aggregate.body.setCollisionCallbackEnabled(true);

        // Mouse lock for movement
        this._initPointerLock();
        window.addEventListener("keydown", (evt) => this._handleKeyDown(evt), false);
        window.addEventListener("keyup", (evt) => this._handleKeyUp(evt), false);
    }

    private _createLight(): void {
        this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    }

    private _createCamera(): void {
        this.camera = new UniversalCamera("FPS", new Vector3(0, 2, 0));
        this.camera.attachControl(this.scene, true);
    }

    private _createMesh(): void {
        const mesh = MeshBuilder.CreateBox("player", {size: 1});
        // set mesh invisible
        mesh.isVisible = false;
        mesh.position = new Vector3(0, 50, 0);
        const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new Color3(0, 0, 1);
        mesh.material = playerMaterial;
        this.mesh = mesh;
        this._meshes.push(mesh);
        this._materials.push(playerMaterial);
    }

    public updatePosition() {
        // Utilisez la direction de la caméra pour déterminer le frontVector
        this.frontVector = this.camera.getDirection(Axis.Z);
        this.rightVector = this.camera.getDirection(Axis.X);
        super.updatePosition();
        this.rotation.x = this.camera.absoluteRotation.x;
        this.rotation.y = this.camera.absoluteRotation.y;
        this.camera.position.x = this.position.x;
        this.camera.position.y = this.position.y + 2;
        this.camera.position.z = this.position.z;
    }

    private _initPointerLock() {
        document.addEventListener('pointerlockchange', (event) => this._changeCallback(event),
            false);
        document.addEventListener('mozpointerlockchange', (event) => this._changeCallback(event),
            false);
        document.addEventListener('webkitpointerlockchange', (event) => this._changeCallback(event),
            false);

        // When the element is clicked, request pointer lock
        const canvas: HTMLCanvasElement = <HTMLCanvasElement> this.scene.getEngine().getRenderingCanvas();
        canvas.onclick = function () {
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

    private _changeCallback(e: Event) {
        const canvas = <HTMLCanvasElement> this.scene.getEngine().getRenderingCanvas();
        if (
            document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas
        ) {
            // We've got a pointer lock for our element, add a mouse listener
            console.log("changeCallback activated");
            document.addEventListener("mousemove", (e) => this._mouseMove(e), false);
            document.addEventListener("mousedown", (e) => this._mouseMove(e), false);
            document.addEventListener("mouseup", (e) => this._mouseMove(e), false);
        } else {
            // Pointer lock is no longer active, remove the callback and mouse listener
            console.log("changeCallback deactivated")
            document.removeEventListener("mousemove", (e) => this._mouseMove(e), false);
            document.removeEventListener("mousedown", (e) => this._mouseMove(e), false);
            document.removeEventListener("mouseup", (e) => this._mouseMove(e), false);
        }
    }

    private _mouseMove(e: MouseEvent): void {
        let deltaTime = this.scene.getEngine().getDeltaTime();

        let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        this.rotation.x += movementY * deltaTime * this.mouseSensitivity;
        this.rotation.y -= movementX * deltaTime * this.mouseSensitivity;
    }

    private _handleKeyUp(evt: KeyboardEvent): void {
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

    private _handleKeyDown(evt: KeyboardEvent): void {
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

    public destroy() {
        super.destroy();
        this._meshes.forEach(mesh => mesh.dispose());
        this._materials.forEach(material => material.dispose());
        this.camera.dispose();
        this.light.dispose();
        this.playerNode.dispose();
        this.aggregate?.body.dispose();
    }
}
