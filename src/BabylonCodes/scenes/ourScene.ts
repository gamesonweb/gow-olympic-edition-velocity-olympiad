import {
    Engine,
    HavokPlugin,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {FirstPersonPlayer} from "../Character/players/firstPersonPlayer";
import * as GUI from "@babylonjs/gui";

export class OurScene {
    scene: Scene;
    engine: Engine;
    physicsEngine: HavokPlugin;
    isSceneSetup: boolean = false;
    canvas: HTMLCanvasElement;
    player: FirstPersonPlayer;
    stackPanel: GUI.StackPanel;

    constructor(engine: Engine,
                canvas: HTMLCanvasElement,
                physicsEngine: HavokPlugin
    ){
        this.engine = engine;
        this.canvas = canvas;
        this.physicsEngine = physicsEngine;
        this.setupScene();
    }

    setupScene(scene = undefined) {
        if (this.isSceneSetup) return;

        // Create a new scene if none is provided
        this.scene = new Scene(this.engine);
        this.scene.enablePhysics(new Vector3(0, -9.81, 0), this.physicsEngine);

        // Create a player
        this.player = new FirstPersonPlayer(this);

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
        const leftWall = MeshBuilder.CreateBox("leftWall", {width: wallThickness, height: wallHeight, depth: ground_size}, this.scene);
        leftWall.position.x = -ground_size / 2 - wallThickness / 2;
        leftWall.material = wallMaterial;
        var leftWallPhysics = new PhysicsAggregate(leftWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur de droite
        const rightWall = MeshBuilder.CreateBox("rightWall", {width: wallThickness, height: wallHeight, depth: ground_size}, this.scene);
        rightWall.position.x = ground_size / 2 + wallThickness / 2;
        rightWall.material = wallMaterial;
        var rightWallPhysics = new PhysicsAggregate(rightWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur du fond
        const backWall = MeshBuilder.CreateBox("backWall", {width: ground_size + wallThickness * 2, height: wallHeight, depth: wallThickness}, this.scene);
        backWall.position.z = -ground_size / 2 - wallThickness / 2;
        backWall.material = wallMaterial;
        var backWallPhysics = new PhysicsAggregate(backWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);

        // Mur de devant
        const frontWall = MeshBuilder.CreateBox("frontWall", {width: ground_size + wallThickness * 2, height: wallHeight, depth: wallThickness}, this.scene);
        frontWall.position.z = ground_size / 2 + wallThickness / 2;
        frontWall.material = wallMaterial;
        var frontWallPhysics = new PhysicsAggregate(frontWall, PhysicsShapeType.BOX, {mass: 0}, this.scene);


        // Affichage de l'inspecteur en mode développement
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Scene inspector enabled");
            // Inspector.Show(this.scene, {enablePopup: false});
            // new Debug.AxesViewer(this.scene, 10);
        }

        this.createGUI();
        this.isSceneSetup = true;
    }

    createGUI() {
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.stackPanel = new GUI.StackPanel();
        this.stackPanel.width = "220px";
        this.stackPanel.isVertical = true;
        this.stackPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.stackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(this.stackPanel);
    }
}
