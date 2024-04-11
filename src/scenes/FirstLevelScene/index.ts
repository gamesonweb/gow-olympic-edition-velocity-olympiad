import {
  Engine,
  HavokPlugin,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType, Material, HemisphericLight, Vector3, Mesh, StandardMaterial, Camera, UniversalCamera
} from "@babylonjs/core";
import {OlympiadScene} from "../OlympiadScene";
import {WelcomeEnemyManager} from "./enemyManager";
import {PlayerState} from "../../character/players/PlayerState";
import * as GUI from "@babylonjs/gui";
import {FirstPersonPlayer} from "../../character/players/FirstPersonPlayer";
import {Temple} from "../../gameObjects/Temple";
import { TempleV2 } from "../../gameObjects/TempleV2";
import {CardSocle} from "../../gameObjects/Card/CardSocle";
import {FlammeCard} from "../../gameObjects/Card/armes/FlammeCard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {ICard} from "../../gameObjects/Card/ICard";


export class FirstLevelScene extends OlympiadScene {

  private _meshes: Mesh[] = [];
  private _materials: Material[] = [];
  private readonly enemyManager: WelcomeEnemyManager;
  private readonly player: FirstPersonPlayer;

  constructor(engine: Engine, playerState) {

    super(engine);

    this.enemyManager = new WelcomeEnemyManager(this);
    this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

    this.player = new FirstPersonPlayer(playerState, this);
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
    let levelgroundwidth = 500;
    let levelgroundheight = 1;
    let levelgrounddepth = 50;

    let levelGround = MeshBuilder.CreateBox("level1ground", {width: levelgroundwidth,
      height: levelgroundheight, depth: levelgrounddepth}, this);
    this._meshes.push(levelGround);
    // a 20 au dessus du sol
    levelGround.position.y = 20;
    levelGround.position.x = levelgroundwidth/2 - 50;
    const objetgroundYref = levelGround.position.y + levelgroundheight/2;
    new PhysicsAggregate(levelGround, PhysicsShapeType.BOX, {mass: 0}, this);

    // temple
    let templedimension = new Vector3(1, 15, 7);
    let templeposition = new Vector3(levelgroundwidth-50-templedimension.z, objetgroundYref +1, 0);
    let temple = new Temple(this, templedimension.x, templedimension.y, templedimension.z);
    temple.position = templeposition;
    temple.rotation = new Vector3(0, 0, 0);
    temple.setup();

    let cardposition1 = new Vector3(10,objetgroundYref, 0);
    let cardposition2 = new Vector3(15,objetgroundYref, 0);
    let cardposition3 = new Vector3(20,objetgroundYref, 0);
    let cardposition4 = new Vector3(25,objetgroundYref, 0);

    let cardAndPositions = [
        {card: new FlammeCard(RareteCard.COMMON), position: cardposition1},
        {card: new FlammeCard(RareteCard.RARE), position: cardposition2},
        {card: new FlammeCard(RareteCard.EPIC), position: cardposition3},
        {card: new FlammeCard(RareteCard.LEGENDARY), position: cardposition4}
    ]
    cardAndPositions.forEach(cardAndPosition => {
        let cardSocle = new CardSocle(this, cardAndPosition.card, cardAndPosition.position, this.callbackOnCardCollision.bind(this));
        this.addComponent(cardSocle);
        this.player.cardList?.push(cardAndPosition.card);
    })

    let templeV2 = new TempleV2(this, new Vector3(50, objetgroundYref, 0), new Vector3(0, -Math.PI/2, 0));
  }


  private _createCards(): void {

  }

  public destroy() {
    super.destroy();
    this._meshes.forEach((mesh) => mesh.dispose());
  }

  public switchToSecondScene() {

  }

  private callbackOnCardCollision(card: ICard) {
    const button = GUI.Button.CreateSimpleButton("but", card.name);
    button.width = "100px"
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    button.onPointerUpObservable.add(function () {
      console.log("clicked");
    });
    this.guiStackPanel.addControl(button);
  }

}


