import {Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3,} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";
import {SceneComponent} from "../../scenes/SceneComponent.ts";

export class Sign implements SceneComponent {
    private scene: Scene;
    private advancedTexture: GUI.AdvancedDynamicTexture;
    private signMesh!: Mesh;

    constructor(text: string, position: Vector3, scene: Scene) {
        this._text = text;
        this._position = position;
        this.scene = scene;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.setup();
    }

    private _text: string;

    get text(): string {
        return this._text;
    }

    private _position: Vector3;

    get position(): Vector3 {
        return this._position;
    }

    setup() {
        const advancedTexture = this.advancedTexture;

        const rect = new GUI.Rectangle();
        rect.width = 0.2;
        rect.height = "40px";
        rect.top = "50px";
        rect.cornerRadius = 20;
        rect.color = "rgba(245, 245, 245, 0.8)"; // Couleur légèrement translucide pour simuler le marbre
        rect.thickness = 2;
        rect.background = "rgba(124,124,124,0.8)"; // Fond noir pour le contraste
        advancedTexture.addControl(rect);

        const label = new GUI.TextBlock();
        label.text = this.text;
        label.color = "black"; // Texte en noir pour le contraste
        label.fontSize = 24;
        label.fontStyle = "italic"; // Style italique pour une touche classique
        label.fontFamily = "Georgia, serif"; // Utiliser une police classique qui évoque l'écriture grecque antique
        label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Centrer le texte horizontalement
        label.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Centrer le texte verticalement
        rect.addControl(label);

        rect.width = this.text.length * 0.01; // Ajuster la largeur du panneau en fonction de la longueur du texte

        rect.isVisible = false; // Définir le panneau comme invisible initialement

        rect.linkOffsetY = -50;
        this.createSignMesh();

        // Before rendering the scene, show the sign if the camera is close enough
        this.scene.registerBeforeRender(() => {
            if (this.scene.activeCamera) {
                let camera = this.scene.activeCamera;
                let distanceToShow = 10;
                let distanceFromCamera = Vector3.Distance(camera.position, this.position);

                if (distanceFromCamera < distanceToShow) {
                    rect.isVisible = true;
                } else {
                    rect.isVisible = false;
                }
            }
        });
    }


    destroy() {
        this.advancedTexture.dispose();
        this.signMesh.dispose();
    }

    private createSignMesh(): Mesh {
        this.signMesh = MeshBuilder.CreatePlane("sign", {width: 1, height: 1}, this.scene);
        this.signMesh.position = this.position;
        this.signMesh.renderingGroupId = 2;

        const material = new StandardMaterial("", this.scene);
        material.diffuseTexture = new Texture("sprites/gameObject/sign.png", this.scene);
        this.signMesh.material = material;

        //this.signMesh.isVisible = false;


        return this.signMesh;
    }
}
