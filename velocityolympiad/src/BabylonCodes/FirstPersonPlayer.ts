import {Matrix, Scene, Vector3, Camera, UniversalCamera ,MeshBuilder,PhysicsAggregate, PhysicsShapeType, TransformNode,Engine, StandardMaterial, Color3 ,Axis} from "@babylonjs/core";

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

    UpdatePlayerPosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean,jump: boolean}){ 
        this.player.updatePosition(keys);
    }
}

class player{
    position: Vector3;
    rotation: Vector3;
    frontVector: Vector3;
    rightVector: Vector3;
    mesh: any | null;  
    aggregate: PhysicsAggregate | null;
    scene: Scene;
    playerNode: TransformNode;
    camera: Camera;
    speed: number = 0.5;
    constructor(scene: Scene, camera: Camera){
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.frontVector = new Vector3(0, 0, 1);
        this.rightVector = new Vector3(1, 0, 0);
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

    updatePosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean,jump: boolean}){

        // Utilisez la direction de la caméra pour déterminer le frontVector
        this.frontVector = this.camera.getDirection(Axis.Z);
        this.rightVector = this.camera.getDirection(Axis.X);
    
        if (this.mesh!==null){
            if (keys.forward){
                this.aggregate?.body.applyImpulse(this.frontVector.scale(this.speed), this.mesh.position);
            }
            if (keys.back){
                this.aggregate?.body.applyImpulse(this.frontVector.scale(-this.speed), this.mesh.position);
            }
            if (keys.right){
                this.aggregate?.body.applyImpulse(this.rightVector.scale(this.speed), this.mesh.position);
            }
            if (keys.left){
                this.aggregate?.body.applyImpulse(this.rightVector.scale(-this.speed), this.mesh.position);
            }
            if (keys.jump){
                this.aggregate?.body.applyImpulse(new Vector3(0, 1, 0).scale(this.speed*2.75), this.mesh.position);
        }
        this.playerNode.position = this.mesh.position;
        this.rotation.x = this.camera.absoluteRotation.x;
        this.rotation.y = this.camera.absoluteRotation.y;
        this.camera.position.x = this.mesh.position.x;
        this.camera.position.y = this.mesh.position.y+2;
        this.camera.position.z = this.mesh.position.z;
        };
    }
}
