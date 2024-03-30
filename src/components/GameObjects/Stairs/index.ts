import {Color3, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3} from "@babylonjs/core";

export class Stairs extends TransformNode {
    steps: number;
    stepHeight: number;
    stepWidth: number;
    stepDepth: number;
    stairsMaterial: StandardMaterial;

    constructor(scene: Scene, name: string, steps: number, stepHeight: number, stepWidth: number, stepDepth: number,
                position: Vector3|undefined = undefined, stairsMaterial: StandardMaterial|undefined = undefined) {
        super(name, scene);
        this.steps = steps;
        this.stepHeight = stepHeight;
        this.stepWidth = stepWidth;
        this.stepDepth = stepDepth;
        if (position === undefined) {
            position = new Vector3(0, 0, 0);
        }
        this.position = position; // Position définie grâce à l'héritage de TransformNode

        if (stairsMaterial === undefined) {
            stairsMaterial = new StandardMaterial(`${name}_material`, scene);
            stairsMaterial.diffuseColor = new Color3(0.75, 0.75, 0.75); // Couleur gris clair pour les marches

        }
        this.stairsMaterial = stairsMaterial;
        this.createStairs();
    }

    createStairs() {
        for (let i = 0; i < this.steps; i++) {
            const step = MeshBuilder.CreateBox(`${this.name}_step${i}`, {
                width: this.stepWidth,
                height: this.stepHeight,
                depth: this.stepDepth,
            }, this._scene);

            step.position = new Vector3(
                0, // x position - centered on the TransformNode
                this.stepHeight / 2 + i * this.stepHeight, // y position - incrementally increase based on the step index
                -(this.stepDepth / 2) * (i + 1) // z position - move each step forward
            );

            step.material = this.stairsMaterial;
            step.parent = this; // Définir le parent de chaque marche à ce TransformNode
        }
    }
}
