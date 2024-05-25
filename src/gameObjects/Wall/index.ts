import {
    Mesh,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {SceneComponent} from "../../scenes/SceneComponent.ts";
import {FlammeCardProjectile} from "../Card/armes/FlammeCardProjectile.ts";

export class Wall extends SceneComponent implements GameObject {
    public mesh!: Mesh;
    private readonly scene: Scene;
    private readonly position: Vector3;
    private aggregate: PhysicsAggregate | null;
    public canDetectCollision: boolean = false;
    public canActOnCollision: boolean = true;
    public health: number = 100;
    public actualhealth: number = this.health;

    constructor(scene: Scene, position: Vector3) {
        super();
        this.position = position;
        this.scene = scene;
        this.scene.collisionsEnabled = true;
        this.aggregate = null
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
        const agg = new PhysicsAggregate(this.mesh, PhysicsShapeType.BOX, {mass: 0}, this.scene);
        this.aggregate = agg;
        this.aggregate;

    }

    // Method to dispose the wall object
    destroy() {
        // Define animation parameters
        let animationFrames = 60; // Number of frames for the animation
        let opacityStep = 1 / animationFrames; // Amount to reduce opacity per frame

        // Start the fade-out animation
        let frame = 0;
        let fadeAnimation = () => {
            // Reduce opacity
            this.mesh.material!.alpha -= opacityStep;

            // Check if animation is complete
            if (++frame < animationFrames) {
                // Continue animation
                requestAnimationFrame(fadeAnimation);
            } else {
                this.mesh.dispose();
            }
        };

        // Start the animation
        fadeAnimation();
    }


    public detectCollision(gameObjects: GameObject[]): void {
        console.log("For now wall does not detect collision: ", gameObjects);
    }

    public takeDamage(damage: number): void {
        console.log('Wall take damage: ', damage);
        this.actualhealth -= damage;
        if (this.actualhealth <= 0) {
            this.destroy();
        }
    }

    public onCollisionCallback(gameObject: GameObject): void {
        if (gameObject instanceof FlammeCardProjectile) {
            console.log('Fireball hit the wall');
            this.takeDamage(this.actualhealth);
            console.log("wall health: ", this.actualhealth);
        }
    }

}
