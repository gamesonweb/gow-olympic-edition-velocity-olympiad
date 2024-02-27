import {Scene, Vector3, Color3, StandardMaterial, ArcRotateCamera, MeshBuilder, HemisphericLight} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";


export class Temple {
    camera: ArcRotateCamera;
    our_scene: OurScene;
    _pillarMaterial: StandardMaterial;

    constructor(our_scene: OurScene) {
        this.our_scene = our_scene;
        this.setup();
    }

    setup() {
        // Set up the temple
        const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), this.our_scene.scene);
        camera.attachControl(this.our_scene.canvas, true);

        // Ajouter une lumière
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.our_scene.scene);

        // Créer une forme de base pour le temple (à remplacer par un modèle détaillé)
        const temple_base = MeshBuilder.CreateBox('temple', {height: 1, width: 2, depth: 3}, this.our_scene.scene);

        // Ajouter une texture ou une matière au temple
        const templeMaterial = new StandardMaterial('templeMaterial', this.our_scene.scene);
        templeMaterial.diffuseColor = new Color3(1, 0.8, 0.6); // Couleur sable
        temple_base.material = templeMaterial;

        // Sol pour la scène
        const ground = MeshBuilder.CreateGround('ground', {width: 50, height: 50}, this.our_scene.scene);

        // setup pillar material
        this._pillarMaterial = new StandardMaterial('pillarMaterial', this.our_scene.scene);
        this._pillarMaterial.diffuseColor = new Color3(1, 0.9, 0.8); // couleur de la pierre

        let numberOfPillars = 8; // nombre de piliers sur un côté
        let spacing = 1; // espacement entre les piliers

        // Côté avant du temple
        for (let i = 0; i < numberOfPillars; i++) {
            let pillar = this.createPillar(this.our_scene.scene);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = 2; // positionner devant
        }

        // Côté arrière du temple
        for (let i = 0; i < numberOfPillars; i++) {
            let pillar = this.createPillar(this.our_scene.scene);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = -2; // positionner derrière
        }

        // Les côtés du temple
        // Pour les côtés, nous devons positionner les piliers le long de l'axe z
        let sidePillars = 4;
        for (let i = 0; i < sidePillars; i++) {
            let pillarLeft = this.createPillar(this.our_scene.scene);
            pillarLeft.position.x = -(numberOfPillars / 2) * spacing;
            pillarLeft.position.z = (i - sidePillars / 2) * spacing;

            let pillarRight = this.createPillar(this.our_scene.scene);
            pillarRight.position.x = (numberOfPillars / 2) * spacing;
            pillarRight.position.z = (i - sidePillars / 2) * spacing;
        }

    }

    createPillar(scene) {
        const pillar = MeshBuilder.CreateCylinder('pillar', {
            diameter: 0.2, // diamètre du pilier
            height: 3, // hauteur du pilier
            tessellation: 24 // nombre de côtés du cylindre, pour le rendre rond
        }, scene);
        pillar.material = this._pillarMaterial;

        return pillar;
    }
}
