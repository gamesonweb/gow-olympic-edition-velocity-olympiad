import {
    ActionManager,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";

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
        rect.cornerRadius = 20;
        rect.color = "Orange";
        rect.thickness = 4;
        rect.background = "green";
        advancedTexture.addControl(rect);

        const label = new GUI.TextBlock();
        label.text = this.text;
        label.color = "white";
        label.fontSize = 24;
        rect.addControl(label);

        rect.isVisible = false; // Définir le panneau comme invisible initialement

        rect.linkOffsetY = -50;
        const signMesh = this.createSignMesh();

        // Associer les événements de survol de la souris pour afficher et masquer le panneau
        signMesh.actionManager = new ActionManager(this.scene);
        signMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger,
                () => {
                    rect.isVisible = true;
                }
            )
        );
        signMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
                () => {
                    rect.isVisible = false;
                }
            )
        );


        console.log("Sign loaded at position: ", this.position.toString());
    }

    destroy() {
        this.advancedTexture.dispose();
        this.signMesh.dispose();
    }

    private createSignMesh(): Mesh {
        this.signMesh = MeshBuilder.CreatePlane("sign", {width: 1, height: 1}, this.scene);
        this.signMesh.position = this.position;

        const material = new StandardMaterial("", this.scene);
        material.diffuseTexture = new Texture("src/assets/textures/sign.jpeg", this.scene);
        this.signMesh.material = material;


        return this.signMesh;
    }
}
