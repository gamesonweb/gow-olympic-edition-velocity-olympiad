import {Scene, Vector3} from "@babylonjs/core";
import {OlympiadScene} from "../OlympiadScene";
import {EnemyManager} from "../EnemyManager";
import {DistanceEnemy} from "../../character/enemy/distance";

export class Level1EnemyManager extends EnemyManager {
    protected scene: Scene
    protected _stopAllAttacks: boolean = false;
    private _distanceEnemy!: DistanceEnemy;

    constructor(scene: Scene) {
        super();
        this.scene = scene;
    }

    init() {
        // Create enemies
    }

    public destroy() {
        // Destroy enemies and cleanup
    }

    addDistanceEnemy(enemydistanceposition: Vector3) {
        // Add a distance enemy to the scene
        this._distanceEnemy = new DistanceEnemy(this.scene, enemydistanceposition);
        this._distanceEnemy.init();
        let olympiadScene = this.scene as OlympiadScene;
        olympiadScene.addGameObject(this._distanceEnemy);
    }

    public stopAllAttacks() {
        super.stopAllAttacks();
        this._distanceEnemy.stopAttack = true;
    }

    public resumeAllAttacks() {
        super.resumeAllAttacks();
        this._distanceEnemy.stopAttack = false;
    }
}
