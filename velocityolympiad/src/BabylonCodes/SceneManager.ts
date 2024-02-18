import {Engine, Scene , MeshBuilder , HemisphericLight, Vector3, HavokPlugin} from '@babylonjs/core';
import HavokPhysics from "@babylonjs/havok";
import { FirstPersonPlayer } from './FirstPersonPlayer';

export class SceneManager{
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;
    pyhsicsEngine: HavokPlugin|void;
    constructor(engine: Engine, canvas: HTMLCanvasElement){
        this.engine = engine;
        this.canvas = canvas;
        this.pyhsicsEngine = this.createPhysicsEngine();
    }

    async initPhysics(){
        const havokPlugin = await HavokPhysics();
        return havokPlugin;
    }

    createPhysicsEngine(){
        this.initPhysics().then((havokPlugin)=>{
            const physicsEngine = new HavokPlugin(true, havokPlugin);
            return physicsEngine;
        }).catch((err)=>{
            console.log(err);
            return void 0;
        });
    }

    createScene(){
        if (this.pyhsicsEngine){
            this.scenes.push(new OurScene(this.engine,this.canvas,this.pyhsicsEngine));
        }
        else{
            console.log("Physics engine not initialized");
        }
    }
    
}

class OurScene{
    scene: Scene;
    engine: Engine;
    pyhsicsEngine: HavokPlugin;
    player: FirstPersonPlayer;
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin){
        this.engine = engine;
        this.pyhsicsEngine = physicsEngine;
        this.scene = this.createScene();
        this.player = new FirstPersonPlayer(this.scene,canvas);
    }

    createScene(){
        const scene = new Scene(this.engine);
        const light = new HemisphericLight("light", new Vector3(0,1,0), scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});
        const gravity = new Vector3(0, -9.81, 0);
        scene.enablePhysics(gravity, this.pyhsicsEngine);
        console.log(light, ground);
        return scene;
    }

}