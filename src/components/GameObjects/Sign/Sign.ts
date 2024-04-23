import { OurScene } from "../../../BabylonCodes/scenes";
import {
    ActionManager,
    Color3,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

export class Sign {
    private _text: string;
    private _position: Vector3;
    private scene: Scene;
    private advancedTexture: GUI.AdvancedDynamicTexture;
    private signMesh: Mesh;

    constructor(text: string, position: Vector3, ourScene: OurScene) {
        this._text = text;
        this._position = position;
        this.scene = ourScene.scene;
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.advancedTexture = advancedTexture;
        this.setup();
    }

    get text(): string {
        return this._text;
    }

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

    private createSignMesh(): Mesh {
        const signMesh = MeshBuilder.CreateBox("signMesh", { width: 1, height: 1, depth: 1 }, this.scene);
        signMesh.position = this.position;

        const material = new StandardMaterial("signMaterial", this.scene);
        material.diffuseColor = new Color3(1, 1, 0);
        signMesh.material = material;

        return signMesh;
    }

    dispose() {
        this.advancedTexture.dispose();
        this.signMesh.dispose();
    }
}
