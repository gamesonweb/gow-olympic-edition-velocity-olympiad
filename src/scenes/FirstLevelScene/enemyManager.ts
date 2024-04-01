import {Scene} from "@babylonjs/core";
import {SceneComponent} from "../SceneComponent";

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
}
