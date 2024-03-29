import {
    Engine,
    HavokPlugin, MeshBuilder, PhysicsAggregate, PhysicsShapeType,
    Scene, StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {FirstPersonPlayer} from "../Character/players/firstPersonPlayer";
import {Inspector} from "@babylonjs/inspector";
import {Debug} from "@babylonjs/core/Legacy/legacy";
import * as GUI from "@babylonjs/gui";


export class OurScene {
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    isSceneSetup: boolean = false;
    canvas: HTMLCanvasElement;
    player: FirstPersonPlayer;

    constructor(engine: Engine,
                canvas: HTMLCanvasElement,
                physicsEngine: HavokPlugin
    ) {
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = physicsEngine;
        this.setupScene();
        this.player = this.createPlayer(canvas);
    }


    setupScene(scene = undefined) {
        if (this.isSceneSetup) return;
        if (scene === undefined) this.scene = this._createScene();
        else this.scene = scene;

        // Ajout du sol
        const ground_size = 100;
        const ground = MeshBuilder.CreateGround("ground", {width: ground_size, height: ground_size}, this.scene);
        var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Ajout des murs invisibles
        const wallThickness = 1; // Épaisseur des murs
        const wallHeight = 10; // Hauteur des murs
        const wallMaterial = new StandardMaterial("wallMaterial", this.scene);
        wallMaterial.alpha = 0; // Rend les murs invisibles

        // Mur de gauche
        const leftWall = MeshBuilder.CreateBox("leftWall", {
            width: wallThickness,
            height: wallHeight,
            depth: ground_size
        }, this.scene);
        leftWall.position.x = -ground_size / 2 - wallThickness / 2;
        leftWall.material = wallMaterial;
        var leftWallPhysics = new PhysicsAggregate(leftWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur de droite
        const rightWall = MeshBuilder.CreateBox("rightWall", {
            width: wallThickness,
            height: wallHeight,
            depth: ground_size
        }, this.scene);
        rightWall.position.x = ground_size / 2 + wallThickness / 2;
        rightWall.material = wallMaterial;
        var rightWallPhysics = new PhysicsAggregate(rightWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur du fond
        const backWall = MeshBuilder.CreateBox("backWall", {
            width: ground_size + wallThickness * 2,
            height: wallHeight,
            depth: wallThickness
        }, this.scene);
        backWall.position.z = -ground_size / 2 - wallThickness / 2;
        backWall.material = wallMaterial;
        var backWallPhysics = new PhysicsAggregate(backWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur de devant
        const frontWall = MeshBuilder.CreateBox("frontWall", {
            width: ground_size + wallThickness * 2,
            height: wallHeight,
            depth: wallThickness
        }, this.scene);
        frontWall.position.z = ground_size / 2 + wallThickness / 2;
        frontWall.material = wallMaterial;
        var frontWallPhysics = new PhysicsAggregate(frontWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Ajout du joueur
        const player = new FirstPersonPlayer(this, this.engine, this.canvas);
        this.player = player;
        player.CreatePlayer();


        // Affichage de l'inspecteur en mode développement
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            // Inspector.Show(this.scene, {enablePopup: false});
            // new Debug.AxesViewer(this.scene, 10);
        }

        this.isSceneSetup = true;
        this._guiUpdate();

    }

    _guiUpdate() {
        var listofcard = this.player.player.cardlist;
            var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            var stackPanel = new GUI.StackPanel();
            stackPanel.width = "220px";
            stackPanel.isVertical = true;
            stackPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            stackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexture.addControl(stackPanel);
            for (var i = 0; i < listofcard.length; i++) {
                var button = GUI.Button.CreateSimpleButton("but", listofcard[i].name);
                button.width = "100px"
                button.height = "50px";
                button.color = "white";
                button.background = "green";
                button.onPointerUpObservable.add(function () {
                    console.log("clicked");
                });
                stackPanel.addControl(button);
            }
    }


    _createScene(enablePhysics: boolean = true): Scene {
        const scene = new Scene(this.engine);
        const gravity = new Vector3(0, -9.81, 0);
        if (enablePhysics) scene.enablePhysics(gravity, this.physicsEngine);
        return scene;
    }

    createPlayer(canvas: HTMLCanvasElement) {
        const player = new FirstPersonPlayer(this, this.engine, canvas);
        player.CreatePlayer();
        return player;
    }
}
