/**
 * Character interface
 */

import {Camera, Scene, Vector3} from "@babylonjs/core";

export interface Character {
    position: Vector3;
    mesh: object | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    isSetup: boolean;
    setupCharacter(scene: Scene, camera: Camera): void;
    takeDamage(amount: number): void;
}
