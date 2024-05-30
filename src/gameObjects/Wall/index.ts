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
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";

export class Wall extends SceneComponent implements GameObject {
    public mesh!: Mesh;
    public canDetectCollision: boolean = false;
    public canActOnCollision: boolean = true;
    public health: number = 100;
    public actualhealth: number = this.health;
    private readonly scene: Scene;
    private readonly position: Vector3;
    private aggregate!: PhysicsAggregate;
    private readonly width: number;
    private readonly height: number;
    private readonly rotation: Vector3;

    constructor(scene: Scene, position: Vector3, width: number, height: number, rotation: Vector3) {
        super();
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.position = position;
        this.scene = scene;
        this.scene.collisionsEnabled = true;
        this.setup();
    }

    setup() {

        const size = 7;

        this.mesh = MeshBuilder.CreateBox("wall", {width: this.width, height: this.height, depth: 1}, this.scene);

        this.mesh.rotation = this.rotation; 
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
        this.aggregate = new PhysicsAggregate(this.mesh, PhysicsShapeType.BOX, {mass: 0}, this.scene);
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
        this.aggregate.dispose();
    }


    public detectCollision(gameObjects: GameObject[]): void {
        console.log("For now wall does not detect collision: ", gameObjects);
    }

    updateState() {
        return;
    }

    public takeDamage(damage: number): void {
        this.actualhealth -= damage;
        if (this.actualhealth <= 0) {
            let olympiadScene: OlympiadScene = <OlympiadScene>this.scene;
            // Remove the wall from the gameObjects array
            olympiadScene.gameObjects.splice(olympiadScene.gameObjects.indexOf(this), 1);
            this.destroy();
        }
    }

    public onCollisionCallback(gameObject: GameObject): void {
        if (gameObject instanceof FlammeCardProjectile) {
            this.takeDamage(this.actualhealth);
        }
    }

}
