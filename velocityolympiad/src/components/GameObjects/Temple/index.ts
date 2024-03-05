import {Scene, Vector3, Color3, StandardMaterial, ArcRotateCamera, MeshBuilder, HemisphericLight,
    FreeCamera, TransformNode, Camera
} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";
import {Stairs} from "../Stairs";

export class Temple {
    camera: Camera;
    ourScene: OurScene;
    _pillarMaterial: StandardMaterial;
    boxHeight: number; // hauteur du temple
    boxWidth: number; // largeur du temple
    boxDepth: number; // profondeur du temple
    pillarHeight: number; // hauteur des piliers
    bixDiameter: number = 0.25; // diamètre de la boîte
    private readonly templeGroup: TransformNode;

    constructor(ourScene: OurScene, boxHeight: number = 1, boxWidth: number = 10, boxDepth: number = 5) {
        this.ourScene = ourScene;
        this.boxHeight = boxHeight;
        this.boxWidth = boxWidth;
        this.boxDepth = boxDepth;
        this.pillarHeight = 6; // hauteur des piliers
        this.templeGroup = new TransformNode('templeGroup', this.ourScene.scene);
        this.setup();
    }

    set position(position: Vector3) {
        this.templeGroup.position = position;
    }

    get position(): Vector3 {
        return this.templeGroup.position;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    _createCamera() {
        if (!this.camera) {
            // const camera = new FreeCamera('camera', new Vector3(0, 5, 10), this.ourScene.scene);
            const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10,
                new Vector3(0, 0, 0), this.ourScene.scene);
            camera.attachControl(this.ourScene.canvas, true);
            this.camera = camera;
        }
    }

    setPillarHeight(pillarHeight: number) {
        this.pillarHeight = pillarHeight;
    }

    setup() {

        // Set up the temple
        this._createCamera();

        // Ajouter une lumière
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.ourScene.scene);
        light.parent = this.templeGroup;

        // Créer une forme de base pour le temple (à remplacer par un modèle détaillé)
        const templeBox = MeshBuilder.CreateBox('templeBox', {height: this.boxHeight,
            width: this.boxWidth, depth: this.boxDepth}, this.ourScene.scene);
        templeBox.parent = this.templeGroup;

        // Ajouter une texture ou une matière au temple
        const templeMaterial = new StandardMaterial('templeMaterial', this.ourScene.scene);
        templeMaterial.diffuseColor = new Color3(1, 0.8, 0.6); // Couleur sable
        templeBox.material = templeMaterial;

        // setup pillar material
        this._pillarMaterial = new StandardMaterial('pillarMaterial', this.ourScene.scene);
        this._pillarMaterial.diffuseColor = new Color3(1, 0.9, 0.8); // couleur de la pierre

        let numberOfPillars = this.boxWidth; // nombre de piliers sur un côté
        let spacing = 1; // espacement entre les piliers

        // Côté avant du temple
        for (let i = 0; i < numberOfPillars + 1; i++) {
            let pillar = this.createPillar(this.ourScene.scene, 'pillar_front' + i);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = this.boxDepth/2; // positionner devant
            pillar.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillar.parent = this.templeGroup;
        }

        // Côté arrière du temple
        for (let i = 0; i < numberOfPillars; i++) {
            let pillar = this.createPillar(this.ourScene.scene, 'pillar_back' + i);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = -this.boxDepth/2; // positionner derrière
            pillar.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillar.parent = this.templeGroup;
        }

        // Les côtés du temple
        // Pour les côtés, nous devons positionner les piliers le long de l'axe z
        let sidePillars = this.boxDepth;
        for (let i = 0; i < sidePillars; i++) {
            let pillarRight = this.createPillar(this.ourScene.scene, 'pillar_right' + i);
            pillarRight.position.x = (numberOfPillars / 2) * spacing;
            pillarRight.position.z = (i - sidePillars / 2) * spacing;
            pillarRight.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillarRight.parent = this.templeGroup;

            if (i == 2 || i == 3) continue; // laisser un espace pour les portes
            let pillarLeft = this.createPillar(this.ourScene.scene, 'pillar_left' + i);
            pillarLeft.position.x = -(numberOfPillars / 2) * spacing;
            pillarLeft.position.z = (i - sidePillars / 2) * spacing;
            pillarLeft.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillarLeft.parent = this.templeGroup;

        }

        // Ajouter un toit incliné au temple
        this.buildRoof();

        // Créer des escaliers devant le temple
        const stairStep = 5; // Nombre de marches
        const stepHeight = 0.2; // Hauteur de chaque marche
        const stepWidth = this.boxDepth; // Largeur de chaque marche (pourrait correspondre à la largeur de l'entrée du temple)
        const stepDepth = 0.5; // Profondeur de chaque marche
        const stairs = new Stairs(this.ourScene.scene, "temple_stairs", stairStep, stepHeight, stepWidth,
            stepDepth, this.position);
        stairs.rotation.y = -Math.PI/2; // Pivoter pour être face au temple
        const stairsPositionZ = - this.boxDepth - stairStep/2*stepDepth ;
        const stairsHeightAdjustment = - this.boxHeight/2;
        stairs.position = new Vector3(stairsPositionZ, stairsHeightAdjustment, 0);

    }

    createPillar(scene, pillarName=undefined) {
        if (pillarName === undefined) pillarName = 'pillar';
        const pillar = MeshBuilder.CreateCylinder(pillarName, {
            diameter: this.bixDiameter, // diamètre du pilier
            height: this.pillarHeight, // hauteur du pilier
            tessellation: 24 // nombre de côtés du cylindre, pour le rendre rond
        }, scene);
        pillar.material = this._pillarMaterial;

        return pillar;
    }

    buildRoof() {
        // utilise une box pour le toit
        // Créer les pentes du toit
        const roofHeight = this.boxDepth; // Profondeur de la box
        const roofDepth = this.boxDepth / 2; // Profondeur de chaque pente

        // Calcul de l'hypoténuse (côté incliné du toit)
        const hypotenuse = roofDepth / Math.cos(Math.PI / 6);

        const roofLeft = MeshBuilder.CreatePlane('roofLeft', { width: this.boxWidth, height: hypotenuse },
            this.ourScene.scene);
        roofLeft.rotation.x = Math.PI / 2;
        roofLeft.rotation.x = -Math.PI / 3; // Incliner le toit
        roofLeft.position.y = this.pillarHeight + this.boxHeight / 4;
        roofLeft.position.z = roofDepth / 2;
        roofLeft.parent = this.templeGroup;

        const roofRight = MeshBuilder.CreatePlane('roofRight', { width: this.boxWidth, height: hypotenuse },
            this.ourScene.scene);
        roofRight.rotation.x = Math.PI / 2;
        roofRight.rotation.x = Math.PI / 3; // Incliner le toit
        roofRight.position.y = this.pillarHeight + this.boxHeight / 4;
        roofRight.position.z = -roofDepth / 2;
        roofRight.parent = this.templeGroup;

        // Créer le fronton triangulaire
        const fronton = MeshBuilder.CreatePlane('fronton', { width: this.boxWidth, height: roofHeight },
            this.ourScene.scene);
        fronton.rotation.x = Math.PI / 2; // Pivoter pour être vertical
        fronton.position.y = this.pillarHeight - this.boxHeight / 2; // Positionner en hauteur
        fronton.parent = this.templeGroup;

        // Ajouter des matériaux (à personnaliser)
        const roofMaterial = new StandardMaterial('roofMaterial', this.ourScene.scene);
        roofMaterial.diffuseColor = new Color3(1, 0.5, 0); // Couleur tuile
        roofLeft.material = roofMaterial;
        roofRight.material = roofMaterial;
        fronton.material = roofMaterial;
    }

}
