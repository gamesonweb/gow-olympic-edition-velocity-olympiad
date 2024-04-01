/**
 * Character interface
 */

import {Camera, Mesh, Scene, Vector3} from "@babylonjs/core";

export interface Character {
    position: Vector3;
    mesh: Mesh | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    init(): void;
    takeDamage(amount: number): void;
}
