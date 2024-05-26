/**
 * Character interface
 */

import {AbstractMesh, Scene, Vector3} from "@babylonjs/core";

export interface Character {
    position: Vector3;
    mesh: AbstractMesh | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;

    init(): void;

    takeDamage(amount: number): void;
}
