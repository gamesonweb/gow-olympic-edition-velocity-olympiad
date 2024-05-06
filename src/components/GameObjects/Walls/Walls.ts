import {
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Color3,
    Vector3,
    PhysicsShapeType, PhysicsAggregate, ActionManager, ExecuteCodeAction, Texture
} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";

export class Wall {
    mesh: Mesh;
    private scene: Scene;
    private position: Vector3;
    private aggregate: PhysicsAggregate| null;

    constructor(ourScene: OurScene, position: Vector3) {
        this.position = position;
        this.scene = ourScene.scene;
        this.scene.collisionsEnabled = true;
        this.aggregate= null
        this.setup();
    }

    setup() {
        this.mesh = MeshBuilder.CreateBox("wall", {width: 10, height: 10, depth: 1}, this.scene);

        // detecter les collisions et savoir si une boule fireball touche le mur
        this.mesh.checkCollisions = true;

        // Ajouter un material au mur
        const wallMaterial = new StandardMaterial("", this.scene);
        wallMaterial.diffuseTexture = new Texture("assets/textures/wall.jpg", this.scene);
        this.mesh.material = wallMaterial;


        // Positionner le mur
        this.mesh.position = this.position;

        // ajout d'une physique body au mur
        const agg =  new PhysicsAggregate(this.mesh, PhysicsShapeType.BOX, {mass: 0}, this.scene);
        this.aggregate = agg;

        // Detect collisions with the fireball


        const observable = this.aggregate?.body.getCollisionObservable();
        if (observable) {
            const observer = observable.add((collisionEvent) => {
                    if (collisionEvent.collidedAgainst.transformNode.name.includes("fireball") || collisionEvent.collider.transformNode.name.includes("fireball")) {
                        console.log('Fireball hit the wall');
                        this.mesh.dispose();
                    }
                    else console.log(collisionEvent.collidedAgainst.transformNode.name);
                }
            );
        }

    }

    // Method to dispose the wall object
    dispose() {
        this.mesh.dispose();

    }

}
