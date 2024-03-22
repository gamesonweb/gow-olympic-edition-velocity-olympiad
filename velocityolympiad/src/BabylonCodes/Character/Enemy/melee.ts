import {Character} from "../Character.ts";
import {Scene, SceneLoader, Vector3} from "@babylonjs/core";
import {FBXLoader} from "babylon-fbx-loader";

// SceneLoader.RegisterPlugin(new FBXLoader());

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

    async CreateMesh() {
        // import mesh with an animation from velocityolympiad/src/assets/Idle.fbx
        await SceneLoader.ImportMeshAsync("", "velocityolympiad/src/assets/", "Remy.fbx", this.scene);
        const mesh = this.scene.getMeshByName("Remy");
        if (mesh) {
            mesh.position = this.position;
            return mesh;
        }
        return null;




    }

    takeDamage(amount: number): void {
        this.hp -= amount;

    }


}

