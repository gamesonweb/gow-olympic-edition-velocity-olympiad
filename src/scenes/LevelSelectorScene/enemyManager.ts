import {Scene} from "@babylonjs/core";
import {EnemyManager} from "../EnemyManager.ts";

export class FirstLevelEnemyManager extends EnemyManager {
    protected scene: Scene
    protected _stopAllAttacks: boolean = false;

    constructor(scene: Scene) {
        super();
        this.scene = scene;
    }

    init() {
        // Create enemies
        this.scene;
    }

    public destroy() {
        // Destroy enemies and cleanup
    }

    public stopAllAttacks() {
        super.stopAllAttacks();
    }

    public resumeAllAttacks() {
        super.resumeAllAttacks();
    }
}
