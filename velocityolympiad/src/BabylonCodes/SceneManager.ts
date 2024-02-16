import {Engine, Scene , MeshBuilder} from '@babylonjs/core';
import { FirstPersonPlayer } from './FirstPersonPlayer';

export class SceneManager{
    scene: Scene;
    engine: Engine;
    player: FirstPersonPlayer;

    constructor(engine: Engine, canvas: HTMLCanvasElement){
        this.engine = engine;
        this.scene = this.CreateScene();
        this.player = new FirstPersonPlayer(this.scene, canvas);
    }

    CreateScene():Scene{
        const scene = new Scene(this.engine);
        const ground = this.CreateGround(scene);
        return scene;
    }

    CreateGround(scene: Scene){
        const ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
        return ground;
    }
}