import {OurScene} from "../../scenes";
import {
    ArcRotateCamera, Color3,
    Engine,
    FreeCamera,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate, PhysicsShapeType, StandardMaterial, Texture,
    Vector3
} from "@babylonjs/core";
import {MeleeEnemy} from "../../Character/Enemy/melee.ts";
import {Temple} from "../../../components/GameObjects/Temple";

export class WelcomeLevel {
    ourScene: OurScene
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.ourScene = new OurScene(engine, canvas, physicsEngine);
        this.setup();
    }

    setup() {
        // Set up the welcome level

        // let camera = new FreeCamera('camera', new Vector3(0, 5, 10), this.ourScene.scene);
        // camera.attachControl(this.ourScene.canvas, true);

        const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10,
            new Vector3(0, 0, 0), this.ourScene.scene);
        camera.attachControl(this.ourScene.canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.ourScene.scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100});
        // var groundPhysics = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this.ourScene.scene);

        let customWallMaterial =  new StandardMaterial("customWallMaterial", this.ourScene.scene)
        customWallMaterial.diffuseTexture = new Texture("src/assets/textures/wall.jpg");

        let customRoofMaterial = new StandardMaterial("customRoofMaterial", this.ourScene.scene);
        customRoofMaterial.diffuseTexture = new Texture("src/assets/textures/roof.jpg");

        let customPillarMaterial = new StandardMaterial("customPillarMaterial", this.ourScene.scene);
        customPillarMaterial.diffuseTexture = new Texture("src/assets/textures/pillar.jpg");

        let customStairsMaterial = new StandardMaterial("customStairsMaterial", this.ourScene.scene);
        customStairsMaterial.diffuseColor = new Color3(1, 0.8, 0.6); // Couleur sable

        let customFrontonMaterial = new StandardMaterial("customFrontonMaterial", this.ourScene.scene);
        customFrontonMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8); // Couleur gris clair

        // Custom materials
        let temple = new Temple(this.ourScene, 1, 25, 10, camera, );
        let temple2 = new Temple(this.ourScene, 1, 10, 5, camera);

        temple.position.x = 10;
        temple.position.z = 20;

        temple2.position.x = -20;

        temple2.wallMaterial = temple.wallMaterial = customWallMaterial;
        temple2.roofMaterial = temple.roofMaterial = customRoofMaterial;
        temple2.pillarMaterial = temple.pillarMaterial = customPillarMaterial;
        temple2.stairsMaterial = temple.stairsMaterial = customStairsMaterial;
        temple2.frontonMaterial = temple.frontonMaterial = customFrontonMaterial;

        temple.setup();
        temple2.setup();

        // Take default materials
        let temple3 = new Temple(this.ourScene, 1, 60, 25, camera);
        temple3.position.x = 40;
        temple3.setup();



        //     add and MeleeEnemy
        const meleeEnemy = new MeleeEnemy(this.ourScene.scene, new Vector3(0, 10, 0));
        meleeEnemy.setupCharacter();


    }
}
