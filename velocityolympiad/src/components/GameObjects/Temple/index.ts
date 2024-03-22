import {
    Vector3, Color3, StandardMaterial, ArcRotateCamera, MeshBuilder, HemisphericLight,
    TransformNode, Camera, Mesh, VertexData
} from "@babylonjs/core";
import {OurScene} from "../../../BabylonCodes/scenes";
import {Stairs} from "../Stairs";

export class Temple {
    camera: Camera | undefined;
    ourScene: OurScene;
    _pillarMaterial: StandardMaterial | undefined;
    boxHeight: number; // hauteur du temple
    boxWidth: number; // largeur du temple
    boxDepth: number; // profondeur du temple
    pillarHeight: number; // hauteur des piliers
    pillarDiameter: number = 0.25; // diamètre de la boîte
    private readonly templeGroup: TransformNode;
    private _doorPositions: { x: number[]; y: number[]; z: number[] };
    private _doorIndexes: number[];
    private _numberOfPillars: number;
    private _spacingPillars: number;
    private _wallMaterial: StandardMaterial;
    private _roofMaterial: StandardMaterial;

    constructor(ourScene: OurScene, boxHeight: number = 1, boxWidth: number = 10, boxDepth: number = 5) {
        this.ourScene = ourScene;
        this.boxHeight = boxHeight;
        this.boxWidth = boxWidth;
        this.boxDepth = boxDepth;
        this.pillarHeight = 6; // hauteur des piliers

        this.templeGroup = new TransformNode('templeGroup', this.ourScene.scene);

        this._doorIndexes = [2, 3];
        this._doorPositions = {x: [], y: [], z: []};
        this._numberOfPillars = this.boxWidth; // nombre de piliers sur un côté
        this._spacingPillars = 1; // espacement entre les piliers

        this._wallMaterial =  new StandardMaterial("wallMaterial", this.ourScene.scene)
        this._wallMaterial.diffuseColor = new Color3(0.8, 0.8, 0.7); // Exemple de couleur

        this._roofMaterial = new StandardMaterial("roofMaterial", this.ourScene.scene);
        this._roofMaterial.diffuseColor = new Color3(1, 0.5, 0); // Couleur tuile
        this.setup();
    }

    set doorIndexes(value: number[]) {
        this._doorIndexes = value;
    }

    get doorIndexes(): number[] {
        return this._doorIndexes;
    }

    set numberOfPillars(value: number) {
        this._numberOfPillars = value;
    }

    get numberOfPillars(): number {
        return this._numberOfPillars;
    }

    set spacingPillars(value: number) {
        this._spacingPillars = value;
    }

    set position(position: Vector3) {
        this.templeGroup.position = position;
    }

    get position(): Vector3 {
        return this.templeGroup.position;
    }

    set wallMaterial(value: StandardMaterial) {
        this._wallMaterial = value;
    }

    get wallMaterial(): StandardMaterial {
        return this._wallMaterial;
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

        let numberOfPillars = this._numberOfPillars // nombre de piliers sur un côté
        let spacing = this._spacingPillars; // espacement entre les piliers

        // Côté avant du temple
        // Les côtés du temple
        // Pour les côtés, nous devons positionner les piliers le long de l'axe z

        let wallPillars = [];
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
        // this.createWall(wallPillars[0], wallPillars[1], Math.PI/2, 0, 2*this.pillarDiameter);

        let sidePillars = this.boxDepth;
        for (let i = 0; i < sidePillars; i++) {
            let pillarRight = this.createPillar(this.ourScene.scene, 'pillar_right' + i);
            pillarRight.position.x = (numberOfPillars / 2) * spacing;
            pillarRight.position.z = (i - sidePillars / 2) * spacing;
            pillarRight.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillarRight.parent = this.templeGroup;

            if (this._doorIndexes.includes(i)) {
                // laisser un espace pour les portes
                this._doorPositions.x.push(pillarRight.position.x);
                this._doorPositions.y.push(pillarRight.position.y);
                this._doorPositions.z.push(pillarRight.position.z);
                continue;
            }
            let pillarLeft = this.createPillar(this.ourScene.scene, 'pillar_left' + i);
            pillarLeft.position.x = -(numberOfPillars / 2) * spacing;
            pillarLeft.position.z = (i - sidePillars / 2) * spacing;
            pillarLeft.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillarLeft.parent = this.templeGroup;
        }

        // Ajouter un toit incliné au temple
        // this.buildRoof();
        this.buildRoofV2();

        // Créer des escaliers devant le temple
        this.createStairs();

        this.createTempleWalls(templeBox);

    }

    createStairs() {
        const stairStep = 5; // Nombre de marches
        const stepHeight = 0.2; // Hauteur de chaque marche
        const stepWidth = this.boxDepth; // Largeur de chaque marche (pourrait correspondre à la largeur de l'entrée du temple)
        const stepDepth = 0.5; // Profondeur de chaque marche
        const stairs = new Stairs(this.ourScene.scene, "temple_stairs", stairStep, stepHeight, stepWidth,
            stepDepth);
        stairs.rotation.y = -Math.PI/2; // Pivoter pour être face au temple
        const stairsPositionX = - this.boxWidth/2 - stairStep/2*stepDepth ;
        const stairsHeightAdjustment = - this.boxHeight/2;
        stairs.position = new Vector3(stairsPositionX, stairsHeightAdjustment, 0);
    }

    createPillar(scene, pillarName=undefined) {
        if (pillarName === undefined) pillarName = 'pillar';
        const pillar = MeshBuilder.CreateCylinder(pillarName, {
            diameter: this.pillarDiameter, // diamètre du pilier
            height: this.pillarHeight, // hauteur du pilier
            tessellation: 24 // nombre de côtés du cylindre, pour le rendre rond
        }, scene);
        if (this._pillarMaterial != undefined) pillar.material = this._pillarMaterial;
        return pillar;
    }

    buildRoofV2() {
        const roofAngle = Math.PI / 6; // Angle d'inclinaison du toit
        const roofHeight = (this.boxDepth/2) / Math.cos(roofAngle); // Profondeur de chaque pente

        const roofBack = MeshBuilder.CreateBox('roofBack', { width: this.boxWidth, height: roofHeight, depth: 0.001 },
            this.ourScene.scene);
        roofBack.rotation.x = roofAngle - Math.PI / 2 ;  // Incliner le toit
        roofBack.position.y = this.pillarHeight + this.boxHeight / 4;
        roofBack.position.z = this.boxDepth / 4;
        roofBack.parent = this.templeGroup;

        const roofRight = MeshBuilder.CreateBox('roofRight', { width: this.boxWidth, height: roofHeight, depth: 0.001 },
            this.ourScene.scene);
        roofRight.rotation.x = Math.PI / 2 - roofAngle;  // Incliner le toit
        roofRight.position.y = this.pillarHeight + this.boxHeight / 4;
        roofRight.position.z = -this.boxDepth / 4;
        roofRight.parent = this.templeGroup;

        const fronton = MeshBuilder.CreateBox('fronton', { width: this.boxWidth, height: this.boxDepth, depth: 0.001 },
            this.ourScene.scene);
        fronton.rotation.x = Math.PI / 2; // Pivoter pour être vertical
        fronton.position.y = this.pillarHeight - this.boxHeight / 2; // Positionner en hauteur
        fronton.parent = this.templeGroup;

        roofBack.material = this._roofMaterial;
        roofRight.material = this._roofMaterial;
        fronton.material = this._roofMaterial;

        let frontonLeftCornerPositions = [
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2), // Sommet 1
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2), // Sommet 2
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2) // Sommet 3
        ];

        // Créer le fronton triangulaire gauche
        const frontonCloseTriangleHeight = Math.sin(roofAngle) * roofHeight; // roofHeight mean Hypotenuse
        const frontonLeftTriangle = this.createTriangularPrism("frontonLeftTriangle", this.boxDepth, 0.001, frontonCloseTriangleHeight );
        frontonLeftTriangle.material = this._roofMaterial;
        frontonLeftTriangle.parent = this.templeGroup;
        frontonLeftTriangle.position.x = - this.boxWidth/2;
        frontonLeftTriangle.position.y = this.pillarHeight - this.boxHeight / 2;
        frontonLeftTriangle.position.z = this.boxDepth/2;
        frontonLeftTriangle.rotation.x = -Math.PI/2;
        frontonLeftTriangle.rotation.y = Math.PI/2;

        // Créer le fronton triangulaire droit
        const frontonRightTriangle = this.createTriangularPrism("frontonRightTriangle", this.boxDepth, 0.001, frontonCloseTriangleHeight );
        frontonRightTriangle.material = this._roofMaterial;
        frontonRightTriangle.parent = this.templeGroup;
        frontonRightTriangle.position.x = this.boxWidth/2;
        frontonRightTriangle.position.y = this.pillarHeight - this.boxHeight / 2;
        frontonRightTriangle.position.z = this.boxDepth/2;
        frontonRightTriangle.rotation.x = -Math.PI/2;
        frontonRightTriangle.rotation.y = Math.PI/2;


    }

    createTriangularPrism(name, width, height, depth) {
        // Créer un maillage vide
        let customMesh = new Mesh(name, this.ourScene.scene);

        // Les sommets du prisme triangulaire
        let positions = [
            0, 0, 0, // Bas arrière gauche 0
            width, 0, 0, // Bas arrière droite 1
            width / 2, 0, depth, // Bas avant centre 2
            0, height, 0, // Haut arrière gauche 3
            width, height, 0, // Haut arrière droite 4
            width / 2, height, depth // Haut avant centre 5
        ];

        // Les faces du prisme
        let indices = [
            0, 1, 2, // Base
            3, 5, 4, // Haut
            0, 2, 5, 0, 5, 3, // Côté gauche
            1, 4, 5, 1, 5, 2, // Côté droit
            0, 3, 4, 0, 4, 1 // Arrière
        ];

        // Appliquer les sommets et les indices au maillage
        let vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;

        // let normals = [];
        // VertexData.ComputeNormals(positions, indices, normals);
        // vertexData.normals = normals;


        vertexData.applyToMesh(customMesh, true);

        return customMesh;
    }

    createTempleWalls(templeBox: Mesh) {
        // Créer les murs du temple
        // Calculer les coins supérieur droit et inférieur gauche du temple du mur arrière
        let upperRightCorner = new Vector3(templeBox.position.x + this.boxWidth/2,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z + this.boxDepth/2);
        let lowerLeftCorner = new Vector3(templeBox.position.x - this.boxWidth/2,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z + this.boxDepth/2);
        this.createWallV2("wall_back", upperRightCorner, lowerLeftCorner);

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur de droite
        upperRightCorner = new Vector3(templeBox.position.x + this.boxDepth/2,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x - this.boxDepth/2,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallRight = this.createWallV2("wall_right", upperRightCorner, lowerLeftCorner);
        wallRight.position.x += this.boxWidth/2;
        wallRight.rotation.y = Math.PI/2;

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur d'avant
        upperRightCorner = new Vector3(templeBox.position.x + this.boxWidth/2,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z - this.boxDepth/2);
        lowerLeftCorner = new Vector3(templeBox.position.x - this.boxWidth/2,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z - this.boxDepth/2);
        this.createWallV2("wall_front", upperRightCorner, lowerLeftCorner);

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur de gauche
        // mur avant la porte
        let doorMinZ = Math.min(...this._doorPositions.z);
        let doorMaxZ = Math.max(...this._doorPositions.z);
        let wallLeftBeforeDoorDistance = Math.abs(doorMinZ - this._spacingPillars + this.boxDepth/2)
        upperRightCorner = new Vector3(templeBox.position.x + wallLeftBeforeDoorDistance,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallLeftBeforeDoor = this.createWallV2("wall_left_before_door", upperRightCorner, lowerLeftCorner);
        wallLeftBeforeDoor.position.x = templeBox.position.x - this.boxWidth/2;
        wallLeftBeforeDoor.rotation.y = Math.PI/2;
        wallLeftBeforeDoor.position.z = doorMinZ - this._spacingPillars - wallLeftBeforeDoorDistance/2;

        // mur après la porte
        let wallLeftAfterDoorDistance = Math.abs(doorMaxZ + this._spacingPillars - this.boxDepth/2);
        upperRightCorner = new Vector3(templeBox.position.x + wallLeftAfterDoorDistance,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallLeftAfterDoor = this.createWallV2("wall_left_after_door", upperRightCorner, lowerLeftCorner);
        wallLeftAfterDoor.position.x = templeBox.position.x - this.boxWidth/2;
        wallLeftAfterDoor.rotation.y = Math.PI/2;
        wallLeftAfterDoor.position.z = doorMaxZ + this._spacingPillars + wallLeftAfterDoorDistance/2;
    }

    createWallV2(name, upperRightCorner: Vector3, lowerLeftCorner: Vector3, thickness: number = 0.02): Mesh {
        // Calculer la largeur et la hauteur du mur
        const width = Math.abs(upperRightCorner.x - lowerLeftCorner.x);
        const height = Math.abs(upperRightCorner.y - lowerLeftCorner.y);
        const depth = thickness;

        // Calculer la position centrale du mur
        const centerX = (upperRightCorner.x + lowerLeftCorner.x) / 2;
        const centerY = (upperRightCorner.y + lowerLeftCorner.y) / 2;
        const centerZ = (upperRightCorner.z + lowerLeftCorner.z) / 2; // Supposant que z est la même pour les deux coins

        // Créer une mesh box pour représenter le mur
        const wall = MeshBuilder.CreateBox(name, {
            width: width,
            height: height,
            depth: depth
        }, this.ourScene.scene);

        // Définir la position du mur
        wall.position.x = centerX;
        wall.position.y = centerY;
        wall.position.z = centerZ;
        wall.material = this._wallMaterial;
        wall.parent = this.templeGroup;

        return wall;
    }

}
