import {Scene, Vector3} from "@babylonjs/core";

export interface Character {
    position: Vector3;
    mesh: object | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;
    setupCharacter(): void;
    takeDamage(amount: number): void;
}