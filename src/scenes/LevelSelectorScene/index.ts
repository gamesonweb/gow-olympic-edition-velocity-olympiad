import {
    Engine,
    HavokPlugin,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType, Material, HemisphericLight, Vector3, Mesh, StandardMaterial, Camera, UniversalCamera,
    SceneLoader,PhysicsBody,PhysicsShapeMesh,PhysicsMotionType
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import * as GUI from "@babylonjs/gui";
import {Player} from "../../character/players";
import {Temple} from "../../gameObjects/Temple";
import {CardSocle} from "../../gameObjects/Card/CardSocle";
import {FlammeCard} from "../../gameObjects/Card/armes/FlammeCard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {ICard} from "../../gameObjects/Card/ICard";

export class LevelSelectorScene extends OlympiadScene {
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];
    private readonly enemyManager: WelcomeEnemyManager;
    private readonly player: Player;
  
    constructor(engine: Engine, playerState) {
  
      super(engine);
  
      this.enemyManager = new WelcomeEnemyManager(this);
      this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène
  
      this.player = new Player(playerState, this);
      this.addComponent(this.player);
    }

    public async init(): Promise<void> {
        await super.init();
        this.player.init();
        this.enemyManager.init();
        this._buildlevelStatic();
    }

    private _buildlevelStatic(): void {
        SceneLoader.ImportMesh("", "models/", "SelectLevelScene.glb", this, (meshes) => {
            const root = meshes[0];
            root.position = new Vector3(0, 0, 0);
            root.rotation = new Vector3(0, 0, 0);
            root.scaling = new Vector3(1, 1, 1);
            const childrens = root.getChildren();
            
            for (let child of childrens){
                const mesh = child as Mesh;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC,false, this);
                body.shape = new PhysicsShapeMesh(mesh,this)
            }
        });
    }
}