import {Vector3, Camera, UniversalCamera, Engine, Scene} from "@babylonjs/core";
import {Player} from "./player";
import {OurScene} from "../../scenes";
import {CardList} from "../../../components/GameObjects/Card/CardList";


export class FirstPersonPlayer extends Player{
    our_scene: OurScene;
    canvas: HTMLCanvasElement;
    engine: Engine;
    mouseSensitivity: number =  0.0002;
    cardlist: CardList;

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
        this.CreateMesh();
    }

    UpdatePlayerPosition(keys: {left: boolean, right: boolean, forward: boolean, back: boolean,jump: boolean}){
        this.updatePosition(keys);
    }
}

