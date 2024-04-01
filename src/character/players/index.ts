/**
 * Index class hérite de Character
 * Dépalcement du joueur
 * movement
 * prendre des dégats
 */

import { Scene, Vector3, Camera } from "@babylonjs/core";
import { Character } from "../interfaces/Character";
import {SceneComponent} from "../../scenes/SceneComponent";

export class Player extends SceneComponent implements Character {
    hp: number;
    isFlying: boolean;
    isSetup: boolean;
    mesh: object | null;
    position: Vector3;
    scene: Scene;

    setupCharacter(scene: Scene, camera: Camera): void {
    }

    takeDamage(amount: number): void {
    }

    destroy(): void {}
}
