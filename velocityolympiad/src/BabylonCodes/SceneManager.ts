import {Engine, Scene , MeshBuilder , HemisphericLight, Vector3, HavokPlugin} from '@babylonjs/core';
import HavokPhysics from "@babylonjs/havok";
import { FirstPersonPlayer } from './FirstPersonPlayer';

export class SceneManager{
    scene: Scene;
    engine: Engine;
    player: FirstPersonPlayer;

    constructor(engine: Engine, canvas: HTMLCanvasElement){
        this.engine = engine;
        this.scene = this.CreateScene();
        this.player = new FirstPersonPlayer(this.scene, canvas);
        this.InitializePhysics();
    }

    CreateScene():Scene{
        const scene = new Scene(this.engine);
        const ground = this.CreateGround(scene)
        ground.position.y = -1;
        const light = new HemisphericLight("light", new Vector3(0, 5, 0), scene);
        console.log(light);

        return scene;
    }

    CreateGround(scene: Scene){
        const ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
        return ground;
    }

    async InitializePhysics(){
        const gravityVector = new Vector3(0, -9.81, 0);
        this.getInitializedHavok().then((PyshicsPlugin) => {
            console.log(PyshicsPlugin);
            this.EnablePhysics(gravityVector, PyshicsPlugin);
            this.player.CreatePlayer();
        });
    }

    EnablePhysics(gravityVector: Vector3, PyshicsPlugin: any){
        const havok = new HavokPlugin(PyshicsPlugin);
        this.scene.enablePhysics(gravityVector, havok);
    }

    async getInitializedHavok(): Promise<any> {
        console.log("HavokPhysics");
        console.log(WebAssembly);
        return await HavokPhysics();
    }
}