import {
    Engine,
    Scene,
    MeshBuilder,
    HemisphericLight,
    Vector3,
    HavokPlugin,
    PhysicsAggregate,
    PhysicsShapeType,
    StandardMaterial, Color3
} from '@babylonjs/core';
import HavokPhysics from "@babylonjs/havok";
import { FirstPersonPlayer } from './FirstPersonPlayer';

export class SceneManager{
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
        this.initPhysics().then((havokPlugin)=>{
            const physicsEngine = new HavokPlugin(true, havokPlugin);
            console.log(physicsEngine);
            this.physicsEngine = physicsEngine;
        });
    }

    createScene(){
        if (this.physicsEngine === undefined){
            throw new Error("Physics engine not created");
        }
        else{
            this.scenes.push(new OurScene(this.engine,this.canvas,this.physicsEngine));
        }
    }
    
}

class OurScene{
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    player: FirstPersonPlayer;
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin){
        this.engine = engine;
        this.physicsEngine = physicsEngine;
        this.scene = this.createScene();
        this.player = this.createPlayer(canvas);
    }

    createScene(){
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        scene.enablePhysics(gravity, this.physicsEngine);
        
        const light = new HemisphericLight("light", new Vector3(0,1,0), scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        return scene;
    }

    createPlayer(canvas: HTMLCanvasElement){
        const player = new FirstPersonPlayer(this.scene,canvas); 
        player.CreatePlayer();
        return player;
    }
}

class FirstLevel {
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    player: FirstPersonPlayer;

    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.engine = engine;
        this.physicsEngine = physicsEngine;
        this.scene = this.createScene();
        this.player = this.createPlayer(canvas);
    }

    createScene() {
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        scene.enablePhysics(gravity, this.physicsEngine);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});

        // create an olympic entrance with pillone and water fall make it an arc
        // Create pillars
        const pillarMaterial = new StandardMaterial("pillarMat", scene);
        pillarMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
        const pillarDiameter = 0.5;
        const pillarHeight = 3;

        function createPillar(position) {
            const pillar = MeshBuilder.CreateCylinder("pillar", {
                diameter: pillarDiameter,
                height: pillarHeight
            }, scene);
            pillar.material = pillarMaterial;
            pillar.position = position;
        }

// Place pillars
        const numPillars = 6;
        for (let i = 0; i < numPillars; i++) {
            const angle = (Math.PI * 2 * i) / numPillars;
            const x = Math.cos(angle) * 2; // Adjust the radius as needed
            const z = Math.sin(angle) * 2; // Adjust the radius as needed
            createPillar(new Vector3(x, 0, z));
        }

// Create entrance arc
        const entranceArc = MeshBuilder.CreateBox("entranceArc", {width: 4, height: 2, depth: 0.1}, scene);
        entranceArc.position.y = 1; // Adjust position as needed

// Create waterfall
        const waterfall = MeshBuilder.CreateBox("waterfall", {width: 2, height: 2, depth: 0.1}, scene);
        waterfall.position.y = 4; // Adjust position as needed
        waterfall.position.z = -2; // Adjust position as needed
        const waterfallMaterial = new StandardMaterial("waterfallMat", scene);
        waterfallMaterial.diffuseColor = new Color3(0.2, 0.5, 1); // Blue color
        waterfall.material = waterfallMaterial;

        // animate the water fall


        return scene;
    }

    createPlayer(canvas: HTMLCanvasElement) {
        const player = new FirstPersonPlayer(this.scene, canvas);
        player.CreatePlayer();
        return player;
    }


}