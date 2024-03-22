import {
    Engine,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    Vector3
} from "@babylonjs/core";
import {OurScene} from "./ourScene";
import {FirstPersonPlayer} from "../Character/players/firstPersonPlayer";

export class FirstLevel extends OurScene {
    player: FirstPersonPlayer;
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin, setupOnCreation: boolean = true) {
        super(engine, canvas, physicsEngine);
        if (setupOnCreation) this.setupScene();
    }

    setupScene() {
        /*  you can pass a scene to the super.setupScene() method to use an existing scene */
        super.setupScene();
        this._createPlayer();

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // CREATE COLUMNS
        let pillarHeight = 20;
        let positionPrincipalColumn = new Vector3(-18, pillarHeight/2, 0);
        this.createColumnsEntrace(pillarHeight, positionPrincipalColumn);
        this.createRoof(positionPrincipalColumn, pillarHeight);
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

    _createPlayer() {
        console.log("Creating player; ", this)
        this.player = new FirstPersonPlayer(this, this.canvas);
    }
}
