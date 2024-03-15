import {Matrix, Scene, Vector3, Camera, UniversalCamera ,MeshBuilder,PhysicsAggregate, PhysicsShapeType, TransformNode,Engine, StandardMaterial, Color3} from "@babylonjs/core";

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
        this.player = new player(scene,this.camera);
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
    aggregate: PhysicsAggregate | null;
    scene: Scene;
    playerNode: TransformNode;
    camera: Camera;
    speed: number = 0.1;
    constructor(scene: Scene, camera: Camera){
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scene = scene;
        this.mesh = null;
        this.aggregate = null;
        this.playerNode = new TransformNode("player", this.scene);
        this.camera = camera;
    }

    CreateMesh(){
        const mesh = MeshBuilder.CreateBox("player", {size: 1});
        mesh.position = new Vector3(0, 50, 0);
        const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new Color3(0, 0, 1);
        mesh.material = playerMaterial;
        const aggregate = new PhysicsAggregate(mesh,PhysicsShapeType.BOX, {mass: 1,friction: 0.5}, this.scene);
        this.aggregate = aggregate;
        this.rotation = mesh.rotation;
        return mesh;
    }

    updatePosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean}){
        if (this.mesh!==null){
            if (keys.left || keys.right || keys.forward || keys.back){
                console.log(this.mesh);
            }
            if (keys.forward){
                var forward = Vector3.TransformCoordinates(new Vector3(0, 0, this.speed), Matrix.RotationY(this.rotation.y));
                this.aggregate?.body.applyImpulse(forward, this.mesh.position);
            }
            if (keys.back){
                var back = Vector3.TransformCoordinates(new Vector3(0, 0, -this.speed), Matrix.RotationY(this.rotation.y));
                this.aggregate?.body.applyImpulse(back, this.mesh.position);
            }
            if (keys.left){
                var left = Vector3.TransformCoordinates(new Vector3(this.speed, 0, 0), Matrix.RotationY(this.rotation.y));
                this.aggregate?.body.applyImpulse(left, this.mesh.position);
            }
            if (keys.right){
                var right = Vector3.TransformCoordinates(new Vector3(this.speed, 0, 0), Matrix.RotationY(this.rotation.y));
                this.aggregate?.body.applyImpulse(right, this.mesh.position);
            }
        }
        this.playerNode.position = this.mesh.position;
        this.camera.position.x = this.mesh.position.x;
        this.camera.position.y = this.mesh.position.y+1;
        this.camera.position.z = this.mesh.position.z;
    };
}
