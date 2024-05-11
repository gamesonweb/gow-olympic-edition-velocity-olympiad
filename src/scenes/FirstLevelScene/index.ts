import {
  Engine,
  HavokPlugin,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType, Material, HemisphericLight, Vector3, Mesh, StandardMaterial, Camera, UniversalCamera
} from "@babylonjs/core";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import * as GUI from "@babylonjs/gui";
import {Player} from "../../character/players";
import {Temple} from "../../gameObjects/Temple";
import {CardSocle} from "../../gameObjects/Card/CardSocle";
import {FlammeCard} from "../../gameObjects/Card/armes/FlammeCard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {ICard} from "../../gameObjects/Card/ICard";
import {Sign} from "../../gameObjects/Sign";
import {Wall} from "../../gameObjects/Wall";

export class FirstLevelScene extends OlympiadScene {

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
    this.player.position = new Vector3(0, 100, 0);
    this.enemyManager.init();
    this._buildWalls();
  }

  private _buildWalls(): void {
    let levelgroundwidth = 50;
    let levelgroundheight = 1;
    let levelgrounddepth = 500;

    let levelGround = MeshBuilder.CreateBox("level1ground", {width: levelgroundwidth,
      height: levelgroundheight, depth: levelgrounddepth}, this);
    this._meshes.push(levelGround);
    // a 20 au dessus du sol
    levelGround.position.y = 20;
    levelGround.position.z = 0;
    console.log(levelGround.position.y)
    console.log(levelGround.position.z)


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
        let cardSocle = new CardSocle(this, cardAndPosition.card, cardAndPosition.position, this.callbackOnCardCollision.bind(this));
        this.addComponent(cardSocle);
    })

    let signposition = new Vector3(5, objetgroundYref + 1, 0);
    new Sign("test", signposition, this);


    // wall destructible
    let wallposition = new Vector3(0, objetgroundYref, 50);

    new Wall(this, wallposition);
  }

  public destroy() {
    super.destroy();
    this._meshes.forEach((mesh) => mesh.dispose());
  }

  public switchToSecondScene() {

  }

  private callbackOnCardCollision(card: ICard) {
    console.log()
    this.player.addCardToCart(card);
  }

}


