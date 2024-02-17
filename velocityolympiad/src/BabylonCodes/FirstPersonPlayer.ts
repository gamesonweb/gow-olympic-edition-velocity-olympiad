import { Scene, FollowCamera, Vector3, Camera } from "@babylonjs/core";

export class FirstPersonPlayer{
    scene: Scene;
    camera: Camera;
    canvas: HTMLCanvasElement;
    constructor(scene: Scene, canvas: HTMLCanvasElement){
        this.scene = scene;
        this.canvas = canvas;
        this.camera = this.CreateCamera();
        this.scene.activeCamera = this.camera;
    }

    CreateCamera():Camera{
        const camera = new FollowCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
        return camera;
    }
}