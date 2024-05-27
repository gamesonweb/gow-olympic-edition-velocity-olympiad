import {SceneComponent} from "./SceneComponent.ts";
import {Scene} from "@babylonjs/core";

export abstract class EnemyManager extends SceneComponent {
    protected abstract scene: Scene
    protected abstract _stopAllAttacks: boolean;

    init() {}

    public stopAllAttacks() {
        this._stopAllAttacks = true;
    }

    public resumeAllAttacks() {
        this._stopAllAttacks = false;
    }
}
