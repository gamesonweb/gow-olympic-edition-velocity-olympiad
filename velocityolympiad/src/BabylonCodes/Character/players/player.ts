import {MeshBuilder, PhysicsAggregate, PhysicsShapeType, Scene, Vector3} from "@babylonjs/core";
import {Character} from "../Character.ts";
import * as console from "console";

export class Player implements Character{
    position: Vector3;
    mesh: object | null;
    scene: Scene;
    hp: number;
    isFlying: boolean;

    constructor(scene: Scene){
        this.position = new Vector3(0, 100, 0);
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
        console.log(aggregate);
        mesh.position = this.position;
        return mesh;
    }

    takeDamage(amount: number): void {
        this.hp -= amount;

    }




}
