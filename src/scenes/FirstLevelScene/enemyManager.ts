import {Scene, Vector3} from "@babylonjs/core";
import {SceneComponent} from "../SceneComponent";
import {DistanceEnemy} from "../../character/enemy/distance.ts";
import {OlympiadScene} from "../OlympiadScene.ts";

export class WelcomeEnemyManager extends SceneComponent {
    private scene: Scene

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

    addDistanceEnemy(enemyDistancePosition: Vector3) {
        // Add a distance enemy to the scene
        let distanceEnemy = new DistanceEnemy(this.scene, enemyDistancePosition);
        let _scene: OlympiadScene = <OlympiadScene>this.scene;
        _scene.gameObjects.push(distanceEnemy);
        _scene.sceneComponents.push(distanceEnemy);
        distanceEnemy.init();
    }
}
