import {Scene, Vector3, Camera, FreeCamera,MeshBuilder,PhysicsAggregate, PhysicsShapeType} from "@babylonjs/core";

export class FirstPersonPlayer{
    scene: Scene;
    camera: Camera;
    canvas: HTMLCanvasElement;
    player: player;
    constructor(scene: Scene, canvas: HTMLCanvasElement){
        this.scene = scene;
        this.canvas = canvas;
        this.camera = this.CreateCamera();
        this.player = new player(scene);
        this.scene.activeCamera = this.camera;
    }

    CreateCamera():Camera{
        const camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.attachControl(this.canvas, true);
        camera.setTarget(Vector3.Zero());
        return camera;
    }

    CreatePlayer(){
        this.player.mesh = this.player.CreateMesh();
    }

}

class player{
    position: Vector3;
    mesh: object | null;  
    scene: Scene;
    constructor(scene: Scene){
        this.position = new Vector3(0, 100, 0);
        this.scene = scene;
        this.mesh = null;
    }

    CreateMesh(){
        const mesh = MeshBuilder.CreateBox("player", {size: 1});
        mesh.position = this.position;
        const aggregate = new PhysicsAggregate(mesh,PhysicsShapeType.BOX, {mass: 1}, this.scene);
        console.log(aggregate);
        mesh.position = this.position;
        return mesh;
    }

}