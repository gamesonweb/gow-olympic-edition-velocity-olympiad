import {Engine, Scene , MeshBuilder , HemisphericLight, Vector3, HavokPlugin , PhysicsAggregate,
    PhysicsShapeType } from '@babylonjs/core';
import HavokPhysics from "@babylonjs/havok";
import { FirstPersonPlayer } from './FirstPersonPlayer';
import { Inspector } from '@babylonjs/inspector';

export class SceneManager{
    // Manage the scenes and Havok physics engine
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;
    physicsEngine: HavokPlugin | undefined;
    constructor(engine: Engine, canvas: HTMLCanvasElement){
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = undefined;
    }

    async initPhysics(){
        const havokPlugin = await HavokPhysics();
        console.log(havokPlugin);
        return havokPlugin;
    }

    async createPhysicsEngine(){
        this.physicsEngine = new HavokPlugin(true, await HavokPhysics());
        // this.initPhysics().then((havokPlugin)=>{
        //     const physicsEngine = new HavokPlugin(true, havokPlugin);
        //     console.log(physicsEngine);
        //     this.physicsEngine = physicsEngine;
        // });
    }

    createScene(empty_scene: boolean = false){
        if (this.physicsEngine === undefined){
            throw new Error("Physics engine not created");
        }
        else{
            this.scenes.push(new OurScene(this.engine,this.canvas,this.physicsEngine, empty_scene));
        }
    }

}

class OurScene{
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    player: FirstPersonPlayer;
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin, empty_scene: boolean = false){
        this.engine = engine;
        this.physicsEngine = physicsEngine;
        if (empty_scene){
            this.scene = this.createEmptyScene();
        } else {
            this.scene = this.createScene();
        }
        this.player = this.createPlayer(canvas);
    }

    createScene(){
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        scene.enablePhysics(gravity, this.physicsEngine);

        const light = new HemisphericLight("light", new Vector3(0,1,0), scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Active scene inspector in DEV mode
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            Inspector.Show(scene, {enablePopup: false});
        }
        return scene;
    }

    createEmptyScene(){
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        scene.enablePhysics(gravity, this.physicsEngine);
        return scene;
    }

    createPlayer(canvas: HTMLCanvasElement){
        const player = new FirstPersonPlayer(this.scene,canvas);
        player.CreatePlayer();
        return player;
    }
}
