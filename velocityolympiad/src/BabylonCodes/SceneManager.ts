import {
    Engine,
    Scene,
    MeshBuilder,
    HemisphericLight,
    Vector3,
    HavokPlugin,
    PhysicsAggregate,
    PhysicsShapeType,
    StandardMaterial, Color3, FluidRenderer, Mesh, PointLight, Texture
} from '@babylonjs/core';
import HavokPhysics from "@babylonjs/havok";
import {FirstPersonPlayer} from './FirstPersonPlayer';

export class SceneManager {
    scenes: OurScene[] = [];
    engine: Engine;
    canvas: HTMLCanvasElement;
    physicsEngine: HavokPlugin | undefined;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = undefined;
    }

    async initPhysics() {
        const havokPlugin = await HavokPhysics();
        console.log(havokPlugin);
        return havokPlugin;
    }

    async createPhysicsEngine() {
        this.initPhysics().then((havokPlugin) => {
            const physicsEngine = new HavokPlugin(true, havokPlugin);
            console.log(physicsEngine);
            this.physicsEngine = physicsEngine;
        });
    }

    createScene() {
        if (this.physicsEngine === undefined) {
            throw new Error("Physics engine not created");
        } else {
            this.scenes.push(new FirstLevel(this.engine, this.canvas, this.physicsEngine));
        }
    }

}

class OurScene {
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
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        return scene;
    }

    createPlayer(canvas: HTMLCanvasElement) {
        const player = new FirstPersonPlayer(this.scene, canvas);
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
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // CREATE COLUMNS
        let pillarHeight = 20;
        let positionPrincipalColumn = new Vector3(-18, pillarHeight/2, 0);
        this.createColumnsEntrace(pillarHeight, positionPrincipalColumn);
        this.createRoof(positionPrincipalColumn, pillarHeight);


        return scene;
    }

    // on va crée l'entrée du panthéon de Rome

    // on va commencer par crée placer les colonnes
    // puis on va crée le toit
    // puis on va crée le sol
    // puis on va crée les murs
    // puis on va crée les statues
    // puis on va crée les portes

    // CREATE COLUMNS

    createColumns(position: Vector3, pillarHeight: number) {
        const column = MeshBuilder.CreateCylinder("column", {diameterTop: 2, diameterBottom: 2, height: pillarHeight});
        column.position = position;
        var columnPhysics = new PhysicsAggregate(column, PhysicsShapeType.CYLINDER, {mass: 0}, this.scene);

    }

    createColumnsEntraceLine(positionPrincipalColumn: Vector3, pillarHeight: number) {

        for (let i = 0; i < 8; i++) {
            this.createColumns(positionPrincipalColumn, pillarHeight);
            positionPrincipalColumn = positionPrincipalColumn.add(new Vector3(7, 0, 0));
        }
    }

    createColumnsEntrace(pillarHeight: number, positionPrincipalColumn: Vector3) {
    //     on va crée les colonnes de l'entrée du panthéon de Rome

        for (let i = 0; i < 3; i++) {
            this.createColumnsEntraceLine(positionPrincipalColumn, pillarHeight);
            positionPrincipalColumn = positionPrincipalColumn.add(new Vector3(0, 0, 5));
        }
    }

    // CREATE ROOF
    createRoof(positionPrincipalColumn: Vector3, pillarHeight: number) {
        const roof = MeshBuilder.CreateBox("roof", {width: 50, height: 1, depth: 50});
        roof.position = positionPrincipalColumn.add(new Vector3(0, pillarHeight, 0));

    }




    createPlayer(canvas: HTMLCanvasElement) {
        const player = new FirstPersonPlayer(this.scene, canvas);
        player.CreatePlayer();
        return player;
    }
}
