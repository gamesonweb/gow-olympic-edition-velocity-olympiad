import {Vector3, Camera, UniversalCamera, Engine} from "@babylonjs/core";
import {Player} from "./player";
import {OurScene} from "../../scenes";

export class FirstPersonPlayer{
    our_scene: OurScene;
    camera: Camera;
    canvas: HTMLCanvasElement;
    player: Player;
    engine: Engine;
    mouseSensitivity: number =  0.0002;

    constructor(our_scene: OurScene ,engine: Engine ,canvas: HTMLCanvasElement){
        this.our_scene = our_scene;
        this.canvas = canvas;
        this.engine = engine;
        this.camera = this.CreateCamera();
        this.player = new Player(this.our_scene.scene,this.camera);
        this.our_scene.scene.activeCamera = this.camera;
        //this.setupFirstPersonPlayer()
    }

    CreateCamera():Camera{
        const camera = new UniversalCamera("FPS", new Vector3(0, 2, 0), this.our_scene.scene);
        camera.attachControl(this.canvas, true);
        return camera;
    }

    CreatePlayer(){
        this.player.mesh = this.player.CreateMesh();
    }

    UpdatePlayerPosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean,jump: boolean}){ 
        this.player.updatePosition(keys);
    }

}

