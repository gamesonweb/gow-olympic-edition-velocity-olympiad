import {Character} from "../Character.ts";
import {MeshBuilder, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import console from "console";


export class MeleeEnemy implements Character{
    position: Vector3;
    mesh: object | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;

    constructor(scene: Scene, position: Vector3){
        this.position = position;
        this.mesh = null;
        this.scene = scene;
        this.hp = 100
        this.isFlying = false
    }

    setupCharacter(){
        this.mesh = this.CreateMesh();
    }

    CreateMesh(){
        const mesh = MeshBuilder.CreateBox("player", {size: 1});
        mesh.position = this.position;
        const aggregate = new PhysicsAggregate(mesh,PhysicsShapeType.BOX, {mass: 1}, this.scene);
        mesh.position = this.position;
        return mesh;
    }




    takeDamage(amount: number): void {
        this.hp -= amount;

    }


}

