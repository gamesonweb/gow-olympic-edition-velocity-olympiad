import {
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
    PhysicsShapeType, PhysicsAggregate, Texture
} from "@babylonjs/core";
import {SceneComponent} from "../../scenes/SceneComponent.ts";

export class Wall extends SceneComponent{
    mesh: Mesh;
    private scene: Scene;
    private position: Vector3;
    private aggregate: PhysicsAggregate| null;

    constructor(scene: Scene, position: Vector3) {
        super();
        this.position = position;
        this.scene = scene;
        this.scene.collisionsEnabled = true;
        this.aggregate= null
        this.setup();
    }

    setup() {

        const size = 7;

        this.mesh = MeshBuilder.CreateBox("wall", {width: size, height: size, depth: 1}, this.scene);

        // detecter les collisions et savoir si une boule fireball touche le mur
        this.mesh.checkCollisions = true;

        // Ajouter un material au mur qui es un image qui s'ajuste a la taille du mur

        const wallMaterial = new StandardMaterial("", this.scene);
        wallMaterial.diffuseTexture = new Texture("src/assets/textures/wall.jpeg", this.scene);


        this.mesh.material = wallMaterial;

        this.position.y += size / 2;
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
    destroy() {
        // animation de destruction du mur



        this.mesh.dispose();
    }

}
