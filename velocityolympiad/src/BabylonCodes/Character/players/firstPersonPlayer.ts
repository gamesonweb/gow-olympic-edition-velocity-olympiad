import {Scene, Vector3, Camera, FreeCamera,MeshBuilder,PhysicsAggregate, PhysicsShapeType} from "@babylonjs/core";
import {Player} from "./player";
import {OurScene} from "../../scenes";

export class FirstPersonPlayer{
    our_scene: OurScene;
    camera: Camera;
    canvas: HTMLCanvasElement;
    player: Player;

    constructor(our_scene: OurScene, canvas: HTMLCanvasElement){
        this.our_scene = our_scene;
        this.camera = this.CreateCamera();
        this.player = new Player(this.our_scene.scene);
        this.our_scene.scene.activeCamera = this.camera;
        this.setupFirstPersonPlayer()
    }

    CreateCamera():Camera{
        console.log(this.our_scene)
        // const camera = new FreeCamera("camera", new Vector3(0, 5, 10), this.our_scene.scene);
        // camera.attachControl(this.canvas, true);
        // camera.setTarget(Vector3.Zero());

        const camera = new FreeCamera("camera", new Vector3(0, 5, 10), this.our_scene.scene);
        camera.attachControl(this.canvas, true);

        return camera;
    }

    setupFirstPersonPlayer(){
        this.player.setupCharacter();
    }

}

