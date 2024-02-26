import {MeshBuilder, PhysicsAggregate, PhysicsShapeType, Scene, Vector3} from "@babylonjs/core";

export class Player{
    position: Vector3;
    mesh: object | null;
    scene: Scene;
    constructor(scene: Scene){
        this.position = new Vector3(0, 100, 0);
        this.mesh = null;
        this.scene = scene;
    }

    setupPlayer(){
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

}
