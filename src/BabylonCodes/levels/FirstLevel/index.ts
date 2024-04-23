import {OurScene} from "../../scenes";
import {
    Color3,
    Engine,
    HavokPlugin,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType, StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {Temple} from "../../../components/GameObjects/Temple";
import {CardSocle} from "../../../components/GameObjects/Card/CardSocle.ts";
import {FlammeCard} from "../../../components/GameObjects/Card/armes/FlammeCard.ts";
import {RareteCard} from "../../../components/GameObjects/Card/RareteCard.ts";
import {Sign} from "../../../components/GameObjects/Sign/Sign.ts";
import {Wall} from "../../../components/GameObjects/Walls/Walls.ts";


export class FirstLevel {
    ourScene: OurScene
    constructor(engine: Engine, canvas: HTMLCanvasElement, physicsEngine: HavokPlugin) {
        this.ourScene = new OurScene(engine, canvas, physicsEngine);
        this.setup();
    }

    setup() {
        // Set up the first level
    //     we gonna create a big lane at Y = 20 with a temple at the end
//     and some cards on the sides

        let levelgroundwidth = 500;
        let levelgroundheight = 1;
        let levelgrounddepth = 50;

        let levelGround = MeshBuilder.CreateBox("level1ground", {width: levelgroundwidth, height: levelgroundheight, depth: levelgrounddepth}, this.ourScene.scene);

        // a 20 au dessus du sol
        levelGround.position.y = 20;
        levelGround.position.x = levelgroundwidth/2 - 50;


        const objetgroundYref = levelGround.position.y + levelgroundheight/2;

        new PhysicsAggregate(levelGround, PhysicsShapeType.BOX, {mass: 0}, this.ourScene.scene);




        // temple
        let templedimension = new Vector3(1, 15, 7);
        let templeposition = new Vector3(levelgroundwidth-50-templedimension.z, objetgroundYref +1, 0);

        let temple = new Temple(this.ourScene, templedimension.x, templedimension.y, templedimension.z);
        temple.position = templeposition;
        temple.rotation = new Vector3(0, 0, 0);
        temple.setup();


        // carte flamme
        let cardposition1 = new Vector3(10,objetgroundYref, 0);
        let cardposition2 = new Vector3(15,objetgroundYref, 0);
        let cardposition3 = new Vector3(20,objetgroundYref, 0);
        let cardposition4 = new Vector3(25,objetgroundYref, 0);

        new CardSocle(this.ourScene, new FlammeCard(RareteCard.COMMON), cardposition1);
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.RARE), cardposition2);
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.EPIC), cardposition3);
        new CardSocle(this.ourScene, new FlammeCard(RareteCard.LEGENDARY), cardposition4);



        // sign
        let signposition = new Vector3(5, objetgroundYref + 1, 0);
        new Sign("test", signposition, this.ourScene);


        // wall destructible
        let wallposition = new Vector3(30, objetgroundYref, 0);

        new Wall(this.ourScene, wallposition);
















    }
}
