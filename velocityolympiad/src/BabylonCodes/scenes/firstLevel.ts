import {
    ArcRotateCamera,
    Engine, FreeCamera,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Vector3
} from "@babylonjs/core";
import {OurScene} from "./ourScene";
import {MeleeEnemy} from "../Character/Enemy/melee";
import {Player} from "../Character/players/player.ts";

export class FirstLevel extends OurScene {
    player: Player;
    MeleeEnemy: MeleeEnemy;
    camera: FreeCamera;
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin, setupOnCreation: boolean = true) {
        super(engine, canvas, physicsEngine);
        if (setupOnCreation) this.setupScene();
    }

    setupScene() {
        /*  you can pass a scene to the super.setupScene() method to use an existing scene */
        super.setupScene();
        this._createCamera();
        this._createPlayer();
        this._createMeleeEnemy();


        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);



    }

    _createCamera() {
        if (!this.camera) {
            // const camera = new FreeCamera('camera', new Vector3(0, 5, 10), this.ourScene.scene);
            const camera = new FreeCamera('camera', new Vector3(0, 5, 10), this.scene);
            camera.attachControl(this.canvas, true);

            this.camera = camera;
        }
    }

    _createPlayer() {
        this.player = new Player(this.scene);
    }

    _createMeleeEnemy(){
        console.log("Creating Melee Enemy");
        this.MeleeEnemy = new MeleeEnemy(this.scene, new Vector3(0, 10, 0));
    }
}
