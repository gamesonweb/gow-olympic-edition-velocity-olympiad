import {Matrix, Scene, Vector3, Camera, UniversalCamera ,MeshBuilder,PhysicsAggregate, PhysicsShapeType, TransformNode,Engine, Node} from "@babylonjs/core";

export class FirstPersonPlayer{
    scene: Scene;
    camera: Camera;
    canvas: HTMLCanvasElement;
    engine: Engine;
    player: player;
    mouseSensitivity: number =  0.0002;
    constructor(scene: Scene, canvas: HTMLCanvasElement,engine: Engine){
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
        this.camera = this.CreateCamera();
        this.player = new player(scene);
        this.scene.activeCamera = this.camera;
    }

    CreateCamera():Camera{
        const camera = new UniversalCamera("FPS", new Vector3(0, 2, 0), this.scene);
        camera.attachControl(this.canvas, true);
        return camera;
    }

    CreatePlayer(){
        this.player.mesh = this.player.CreateMesh();
    }

    UpdatePlayerPosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean}){ 
        this.player.updatePosition(keys);
    }
}

class player{
    position: Vector3;
    rotation: Vector3;
    mesh: any | null;  
    scene: Scene;
    playerNode: TransformNode;
    cameraNode: Node|null;
    speed: number = 10;
    constructor(scene: Scene){
        this.position = new Vector3(0, 100, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scene = scene;
        this.mesh = null;
        this.playerNode = new TransformNode("player", this.scene);
        this.cameraNode = scene.getNodeByName("camera");
        this.playerNode.parent = this.cameraNode;
        
    }

    CreateMesh(){
        const mesh = MeshBuilder.CreateBox("player", {size: 1});
        mesh.position = this.position;
        const aggregate = new PhysicsAggregate(mesh,PhysicsShapeType.BOX, {mass: 1}, this.scene);
        mesh.position = this.position;
        this.rotation = mesh.rotation;
        return mesh;
    }

    updatePosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean}){
        let tmp = this.position;
        if (this.mesh!==null){
            // if a key is pressed :
            if (keys.left || keys.right || keys.forward || keys.back){
                console.log(tmp);
            }
            if (keys.forward){
                var forward = Vector3.TransformCoordinates(new Vector3(0, 0, this.speed), Matrix.RotationY(this.rotation.y));
                this.mesh.applyImpulse(forward, this.mesh.getAbsolutePosition());
            }
            if (keys.back){
                var back = Vector3.TransformCoordinates(new Vector3(0, 0, -this.speed), Matrix.RotationY(this.rotation.y));
                tmp.addInPlace(back);
            }
            if (keys.left){
                var left = Vector3.TransformCoordinates(new Vector3(this.speed, 0, 0), Matrix.RotationY(this.rotation.y));
                tmp.addInPlace(left);
            }
            if (keys.right){
                var right = Vector3.TransformCoordinates(new Vector3(this.speed, 0, 0), Matrix.RotationY(this.rotation.y));
                tmp.addInPlace(right);
            }
        }
        this.position = tmp;
    };
    
}
