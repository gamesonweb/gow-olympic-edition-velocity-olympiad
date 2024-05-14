import {
  Engine,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType, Material, HemisphericLight, Vector3, Mesh, StandardMaterial
} from "@babylonjs/core";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import {PlayerState} from "../../character/players";
import {Player} from "../../character/players";
import {FirstLevelScene} from "../FirstLevelScene";
import {Temple} from "../../gameObjects/Temple";

export class WelcomeScene extends OlympiadScene {

  private _meshes: Mesh[] = [];
  private _materials: Material[] = [];
  private readonly enemyManager: WelcomeEnemyManager;
  constructor(engine: Engine, playerState: PlayerState) {

    super(engine);

    this.enemyManager = new WelcomeEnemyManager(this);
    this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

    this.player = new Player(playerState, this);
    this.addComponent(this.player);
  }

  public async init(): Promise<void> {
    await super.init();
    this.player!.init();
    this.enemyManager.init();
    this._buildWalls();
    this._createTemple();

    setTimeout(() => {
        this.switchToFirstScene();
    }, 5000);
  }


  private _buildWalls(): void {
    const ground_size = 100;
    const ground = MeshBuilder.CreateGround("ground", {width: ground_size, height: ground_size}, this);
    this._meshes.push(ground);
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, {mass: 0}, this);

    const wallThickness = 1; // Épaisseur des murs
    const wallHeight = 10; // Hauteur des murs
    const wallMaterial = new StandardMaterial("wallMaterial", this);
    wallMaterial.alpha = 0; // Rend les murs invisibles
    this._materials.push(wallMaterial);

    const leftWall = MeshBuilder.CreateBox("leftWall", {
      width: wallThickness, height: wallHeight,
      depth: ground_size
    }, this);
    leftWall.position.x = -ground_size / 2 - wallThickness / 2;
    leftWall.material = wallMaterial;
    this._meshes.push(leftWall);
    new PhysicsAggregate(leftWall, PhysicsShapeType.BOX, {mass: 0}, this);

    // Mur de droite
    const rightWall = MeshBuilder.CreateBox("rightWall", {
      width: wallThickness, height: wallHeight,
      depth: ground_size
    }, this);
    rightWall.position.x = ground_size / 2 + wallThickness / 2;
    rightWall.material = wallMaterial;
    this._meshes.push(rightWall);
    new PhysicsAggregate(rightWall, PhysicsShapeType.BOX, {mass: 0}, this);

    // Mur du fond
    const backWall = MeshBuilder.CreateBox("backWall", {
      width: ground_size + wallThickness * 2,
      height: wallHeight, depth: wallThickness
    }, this);
    backWall.position.z = -ground_size / 2 - wallThickness / 2;
    backWall.material = wallMaterial;
    this._meshes.push(backWall);
    new PhysicsAggregate(backWall, PhysicsShapeType.BOX, {mass: 0}, this);

    // Mur de devant
    const frontWall = MeshBuilder.CreateBox("frontWall", {
      width: ground_size + wallThickness * 2,
      height: wallHeight, depth: wallThickness
    }, this);
    frontWall.position.z = ground_size / 2 + wallThickness / 2;
    frontWall.material = wallMaterial;
    this._meshes.push(frontWall);
    new PhysicsAggregate(frontWall, PhysicsShapeType.BOX, {mass: 0}, this);
    new HemisphericLight("light", new Vector3(0, 1, 0), this);
  }

  private _createTemple(): void {
    let temple = new Temple(this, 1, 15, 7);
    temple.position = new Vector3(5, 0, -15);
    temple.rotation = new Vector3(0, Math.PI / 2, 0);
    temple.setup();
  }

  public destroy() {
    super.destroy();
    this._meshes.forEach((mesh) => mesh.dispose());
    this._materials.forEach((material) => material.dispose());
  }

  public switchToFirstScene() {
    let firstLevelScene: FirstLevelScene = new FirstLevelScene(this.engine, this.player!.playerState);
    this.engine.scenes.push(firstLevelScene);
    firstLevelScene.init().then(() => {
      this.destroy();
    });
  }

}


