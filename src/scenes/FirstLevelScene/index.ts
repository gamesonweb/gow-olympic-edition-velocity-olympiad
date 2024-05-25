import {Engine, Material, Mesh, MeshBuilder, PhysicsAggregate, PhysicsShapeType, Vector3} from "@babylonjs/core";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import {Player, PlayerState} from "../../character/players";
import {CardSocle} from "../../gameObjects/Card/CardSocle";
import {FlammeCard} from "../../gameObjects/Card/armes/FlammeCard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {Sign} from "../../gameObjects/Sign";
import {Wall} from "../../gameObjects/Wall";

export class FirstLevelScene extends OlympiadScene {

  private _meshes: Mesh[] = [];
  private _materials: Material[] = [];
  private readonly enemyManager: WelcomeEnemyManager;
  protected readonly player: Player;

  constructor(engine: Engine, playerState: PlayerState) {

    super(engine);

    this.enemyManager = new WelcomeEnemyManager(this);
    this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

    this.player = new Player(playerState, this);
  }

  public async init(): Promise<void> {
    await super.init();
    this.player.init();
    this.player.position = new Vector3(0, 100, 0);
    this.enemyManager.init();
    this._buildWalls();
    this.addComponent(this.player);
    this.addGameObject(this.player);
  }

  private _buildWalls(): void {
    let levelgroundwidth = 50;
    let levelgroundheight = 1;
    let levelgrounddepth = 500;

    let levelGround = MeshBuilder.CreateBox("level1ground", {width: levelgroundwidth,
      height: levelgroundheight, depth: levelgrounddepth}, this);
    this._meshes.push(levelGround);
    // a 20 au dessus du sol
    levelGround.position.y = 0;
    levelGround.position.z = 0;


    const objetgroundYref = levelGround.position.y + levelgroundheight/2;
    new PhysicsAggregate(levelGround, PhysicsShapeType.BOX, {mass: 0}, this);


    let cardposition1 = new Vector3(0,objetgroundYref, 10);
    let cardposition2 = new Vector3(0,objetgroundYref, 15);
    let cardposition3 = new Vector3(0,objetgroundYref, 20);
    let cardposition4 = new Vector3(0,objetgroundYref, 25);

    let cardAndPositions = [
        {card: new FlammeCard(RareteCard.COMMON), position: cardposition1},
        {card: new FlammeCard(RareteCard.RARE), position: cardposition2},
        {card: new FlammeCard(RareteCard.EPIC), position: cardposition3},
        {card: new FlammeCard(RareteCard.LEGENDARY), position: cardposition4}
    ]
    cardAndPositions.forEach(cardAndPosition => {
        let cardSocle = new CardSocle(this, cardAndPosition.card, cardAndPosition.position);
        this.addComponent(cardSocle);
        this.addGameObject(cardSocle);
        if(cardSocle.card instanceof FlammeCard){
            this.addComponent(cardSocle.card.projectile);
            this.addGameObject(cardSocle.card.projectile);
        }
    })

    let signposition = new Vector3(5, objetgroundYref + 1, 0);
    let sign = new Sign("test", signposition, this);
    this.addComponent(sign);

    let enemydistanceposition = new Vector3(0, objetgroundYref, 30);
    this.enemyManager.addDistanceEnemy(enemydistanceposition);


    // wall destructible
    let wallposition = new Vector3(0, objetgroundYref, 50);

    let wall = new Wall(this, wallposition);
    this.addComponent(wall);
    this.addGameObject(wall);
  }

  public destroy() {
    super.destroy();
    this._meshes.forEach((mesh) => mesh.dispose());
    this._materials.forEach((material) => material.dispose());
  }

  public switchToSecondScene() {

  }

}


