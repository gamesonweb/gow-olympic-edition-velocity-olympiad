import {Scene, Vector3} from "@babylonjs/core";
import {SceneComponent} from "../SceneComponent";
import {DistanceEnemy} from "../../character/enemy/distance.ts";

export class WelcomeEnemyManager extends SceneComponent {
    private scene: Scene
    private gameObject: GameObject[];

    constructor(scene: Scene, gameObject: GameObject[]) {
        super();
        this.scene = scene;
        this.gameObject = gameObject;
    }

    init() {
        // Create enemies
    }

    public destroy() {
        // Destroy enemies and cleanup
    }

    addDistanceEnemy(enemydistanceposition: Vector3) {
        // Add a distance enemy to the scene
        let distanceEnemy = new DistanceEnemy(this.scene, enemydistanceposition);
        distanceEnemy.init();
        this.gameObject.push(distanceEnemy);


    }
}
