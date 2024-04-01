import {
    Camera,
    Color3,
    HemisphericLight,
    Mesh,
    MeshBuilder, Scene,
    StandardMaterial,
    Texture,
    TransformNode,
    Vector3,
    VertexData
} from "@babylonjs/core";
import {Stairs} from "../Stairs";

export class Temple {
    static templeCount: number = 0;

    private _isSetup: boolean = false;
    camera: Camera | undefined;
    private readonly _scene: Scene
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
    private _pillarMaterial: StandardMaterial | undefined;
    private _wallMaterial: StandardMaterial | undefined;
    private _roofMaterial: StandardMaterial | undefined;
    private _stairsMaterial: StandardMaterial | undefined;
    private _templeBoxMaterial: StandardMaterial | undefined;
    private _frontonMaterial: StandardMaterial | undefined;
    private _id: string;
    private prefix: string;

    constructor(scene: Scene, boxHeight: number = 1, boxWidth: number = 10, boxDepth: number = 5, camera?: Camera,
                onlyConfigure: boolean = true) {

        this._scene = scene;
        this.id = (Temple.templeCount++).toString();
        this.boxHeight = boxHeight;
        this.boxWidth = boxWidth;
        this.boxDepth = boxDepth;
        this.pillarHeight = 6; // hauteur des piliers

        this.templeGroup = new TransformNode(`templeGroup_${this._id}`, this._scene);

        this._doorIndexes = [2, 3];
        this._doorPositions = {x: [], y: [], z: []};
        this._numberOfPillars = this.boxWidth; // nombre de piliers sur un côté
        this._spacingPillars = 1; // espacement entre les piliers

        if (camera !== undefined) { this.camera = camera;}
        if (!onlyConfigure) this.setup();

    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
        this.prefix = `temple_${this._id}_`;
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

    set rotation(rotation: Vector3) {
        this.templeGroup.rotation = rotation;
    }

    get rotation(): Vector3 {
        return this.templeGroup.rotation;
    }

    set wallMaterial(value: StandardMaterial) {
        this._wallMaterial = value;
    }

    get wallMaterial(): StandardMaterial {
        return <StandardMaterial>this._wallMaterial;
    }

    set roofMaterial(value: StandardMaterial) {
        this._roofMaterial = value;
    }

    get roofMaterial(): StandardMaterial {
        return <StandardMaterial>this._roofMaterial;
    }

    set pillarMaterial(value: StandardMaterial) {
        this._pillarMaterial = value;
    }

    get pillarMaterial(): StandardMaterial {
        return <StandardMaterial>this._pillarMaterial;
    }

    set stairsMaterial(value: StandardMaterial) {
        this._stairsMaterial = value;
    }

    get stairsMaterial(): StandardMaterial {
        return <StandardMaterial>this._stairsMaterial;
    }

    set templeBoxMaterial(value: StandardMaterial) {
        this._templeBoxMaterial = value;
    }

    get templeBoxMaterial(): StandardMaterial {
        return <StandardMaterial>this._templeBoxMaterial;
    }

    set frontonMaterial(value: StandardMaterial) {
        this._frontonMaterial = value;
    }

    get frontonMaterial(): StandardMaterial {
        return <StandardMaterial>this._frontonMaterial;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    setPillarHeight(pillarHeight: number) {
        this.pillarHeight = pillarHeight;
    }

    _createMissingMaterials() {

        if (!this._templeBoxMaterial) {
            this._templeBoxMaterial = new StandardMaterial(this.prefix + 'templeMaterial', this._scene);
            this._templeBoxMaterial.diffuseTexture = new Texture("src/assets/textures/wall.jpg");
        }
        if(!this._wallMaterial) {
            this._wallMaterial =  new StandardMaterial(this.prefix + "wallMaterial", this._scene)
            this._wallMaterial.diffuseTexture = new Texture("src/assets/textures/wall.jpg");
        }

        if (!this._roofMaterial) {
            this._roofMaterial = new StandardMaterial(this.prefix + "roofMaterial", this._scene);
            this._roofMaterial.diffuseTexture = new Texture("src/assets/textures/roof.jpg");
        }

        if (!this._pillarMaterial) {
            this._pillarMaterial = new StandardMaterial(this.prefix + 'pillarMaterial', this._scene);
            this._pillarMaterial.diffuseTexture = new Texture("src/assets/textures/pillar.jpg");
        }

        if (!this._stairsMaterial) {
            this._stairsMaterial = new StandardMaterial(this.prefix + 'templeMaterial', this._scene);
            this._stairsMaterial.diffuseTexture = new Texture("src/assets/textures/wall.jpg");
        }

        if(!this._frontonMaterial) {
            this._frontonMaterial = new StandardMaterial(this.prefix + 'frontonMaterial', this._scene);
            this._frontonMaterial.diffuseColor = new Color3(0.8, 0.5, 0); // Couleur tuile
        }

    }

    setup() {
        if (this._isSetup) return;
        // Set up the temple
        this._createMissingMaterials();

        // Ajouter une lumière
        const light = new HemisphericLight(this.prefix + 'light', new Vector3(0, 1, 0), this._scene);
        light.parent = this.templeGroup;

        // Créer une forme de base pour le temple (à remplacer par un modèle détaillé)
        const templeBox = MeshBuilder.CreateBox(this.prefix + 'templeBox', {height: this.boxHeight,
            width: this.boxWidth, depth: this.boxDepth}, this._scene);
        templeBox.parent = this.templeGroup;

        // Ajouter une texture ou une matière au temple
        templeBox.material = <StandardMaterial>this._templeBoxMaterial;


        let numberOfPillars = this._numberOfPillars // nombre de piliers sur un côté
        let spacing = this._spacingPillars; // espacement entre les piliers

        // Côté avant du temple
        // Les côtés du temple
        // Pour les côtés, nous devons positionner les piliers le long de l'axe z

        let wallPillars = [];
        for (let i = 0; i < numberOfPillars + 1; i++) {
            let pillar = this.createPillar(this._scene, this.prefix + 'pillar_front' + i);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = this.boxDepth/2; // positionner devant
            pillar.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillar.parent = this.templeGroup;
        }

        // Côté arrière du temple
        for (let i = 0; i < numberOfPillars; i++) {
            let pillar = this.createPillar(this._scene, this.prefix + 'pillar_back' + i);
            pillar.position.x = (i - numberOfPillars / 2) * spacing;
            pillar.position.z = -this.boxDepth/2; // positionner derrière
            pillar.position.y = this.pillarHeight / 2 - this.boxHeight/2; // positionner au-dessus du sol
            pillar.parent = this.templeGroup;
        }
        // this.createWall(wallPillars[0], wallPillars[1], Math.PI/2, 0, 2*this.pillarDiameter);

        let sidePillars = this.boxDepth;
        for (let i = 0; i < sidePillars; i++) {
            let pillarRight = this.createPillar(this._scene, this.prefix + 'pillar_right' + i);
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
            let pillarLeft = this.createPillar(this._scene, this.prefix + 'pillar_left' + i);
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

        const templeMesh = new Mesh("templeMesh", this._scene);

        // 2. Ajoutez les meshes contenus dans le TransformNode en tant qu'enfants du Mesh conteneur
        this.templeGroup.getChildren().forEach(child => {
            if (child instanceof Mesh) {
                templeMesh.addChild(child);
            }
        });
        // let physicsAggregate =
        this._isSetup = true;
    }

    createStairs() {
        const stairStep = 5; // Nombre de marches
        const stepHeight = 0.2; // Hauteur de chaque marche
        const stepWidth = this.boxDepth; // Largeur de chaque marche (pourrait correspondre à la largeur de l'entrée du temple)
        const stepDepth = 0.5; // Profondeur de chaque marche
        const stairs = new Stairs(this._scene, this.prefix + "stairs", stairStep, stepHeight, stepWidth,
            stepDepth, undefined, this._stairsMaterial);
        stairs.rotation.y = -Math.PI/2; // Pivoter pour être face au temple
        const stairsPositionX = - this.boxWidth/2 - stairStep/2*stepDepth ;
        const stairsHeightAdjustment = - this.boxHeight/2;
        stairs.position = new Vector3(stairsPositionX, stairsHeightAdjustment, 0);
        stairs.parent = this.templeGroup;
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
        // const roofAngle = Math.PI / 6; // Angle d'inclinaison du toit
        // const roofHeight = (this.boxDepth/2) / Math.cos(roofAngle); // Profondeur de chaque pente
        const frontonHeight = 3; // Hauteur du fronton
        const roofHeight = Math.sqrt(Math.pow(frontonHeight, 2) + Math.pow(this.boxDepth/2, 2)); // Hauteur du toit
        const roofAngle = Math.atan(frontonHeight / (this.boxDepth / 2));


        const roofBack = MeshBuilder.CreateBox(this.prefix + 'roofBack', { width: this.boxWidth, height: roofHeight, depth: 0.001 },
            this._scene);
        roofBack.rotation.x = roofAngle - Math.PI / 2 ;  // Incliner le toit
        roofBack.position.y = this.pillarHeight + this.boxHeight;
        roofBack.position.z = this.boxDepth / 4;
        roofBack.parent = this.templeGroup;

        const roofFront = MeshBuilder.CreateBox(this.prefix + 'roofFront', { width: this.boxWidth, height: roofHeight, depth: 0.001 },
            this._scene);
        roofFront.rotation.x = Math.PI / 2 - roofAngle;  // Incliner le toit
        roofFront.position.y = this.pillarHeight + this.boxHeight;
        roofFront.position.z = -this.boxDepth / 4;
        roofFront.parent = this.templeGroup;

        const fronton = MeshBuilder.CreateBox(this.prefix + 'fronton', { width: this.boxWidth, height: this.boxDepth, depth: 0.001 },
            this._scene);
        fronton.rotation.x = Math.PI / 2 ; // Pivoter pour être vertical
        fronton.position.y = this.pillarHeight - this.boxHeight / 2; // Positionner en hauteur
        fronton.parent = this.templeGroup;

        roofBack.material = <StandardMaterial>this._roofMaterial;
        roofFront.material = <StandardMaterial>this._roofMaterial;
        fronton.material = this.frontonMaterial;

        // Inverser les normales du fronton pour qu'il soit visible de l'intérieur
        let vertexData = VertexData.ExtractFromMesh(fronton);
        let normals = vertexData.normals;
        // Inverser chaque normale
        if (normals) {vertexData.normals = normals.map((n) => -n);}
        // Appliquer les normales inversées au mesh
        vertexData.applyToMesh(fronton, true);

        let frontonLeftCornerPositions = [
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2), // Sommet 1
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2), // Sommet 2
            new Vector3(- this.boxWidth/2, this.boxHeight, this.boxDepth/2) // Sommet 3
        ];

        // Créer le fronton triangulaire gauche
        const frontonCloseTriangleHeight = Math.sin(roofAngle) * roofHeight; // roofHeight mean Hypotenuse
        const frontonLeftTriangle = this.createTriangularPrism(this.prefix + "frontonLeftTriangle", this.boxDepth, 0.001, frontonCloseTriangleHeight );
        frontonLeftTriangle.material = <StandardMaterial>this._roofMaterial;
        frontonLeftTriangle.parent = this.templeGroup;
        frontonLeftTriangle.position.x = - this.boxWidth/2;
        frontonLeftTriangle.position.y = this.pillarHeight - this.boxHeight / 2;
        frontonLeftTriangle.position.z = this.boxDepth/2;
        frontonLeftTriangle.rotation.x = -Math.PI/2;
        frontonLeftTriangle.rotation.y = Math.PI/2;
        frontonLeftTriangle.material = <StandardMaterial>this._wallMaterial;

        // Créer le fronton triangulaire droit
        const frontonRightTriangle = this.createTriangularPrism(this.prefix + "frontonRightTriangle", this.boxDepth, 0.001, frontonCloseTriangleHeight );
        frontonRightTriangle.material = <StandardMaterial>this._roofMaterial;
        frontonRightTriangle.parent = this.templeGroup;
        frontonRightTriangle.position.x = this.boxWidth/2;
        frontonRightTriangle.position.y = this.pillarHeight - this.boxHeight / 2;
        frontonRightTriangle.position.z = this.boxDepth/2;
        frontonRightTriangle.rotation.x = -Math.PI/2;
        frontonRightTriangle.rotation.y = Math.PI/2;
        frontonRightTriangle.material = <StandardMaterial>this._wallMaterial;


    }

    createTriangularPrism(name, width, height, depth) {
        // Créer un maillage vide
        let customMesh = new Mesh(name, this._scene);

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
        this.createWallV2(this.prefix + "wall_back", upperRightCorner, lowerLeftCorner);

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur de droite
        upperRightCorner = new Vector3(templeBox.position.x + this.boxDepth/2,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x - this.boxDepth/2,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallRight = this.createWallV2(this.prefix + "wall_right", upperRightCorner, lowerLeftCorner);
        wallRight.position.x += this.boxWidth/2;
        wallRight.rotation.y = Math.PI/2;

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur d'avant
        upperRightCorner = new Vector3(templeBox.position.x + this.boxWidth/2,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z - this.boxDepth/2);
        lowerLeftCorner = new Vector3(templeBox.position.x - this.boxWidth/2,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z - this.boxDepth/2);
        this.createWallV2(this.prefix + "wall_front", upperRightCorner, lowerLeftCorner);

        // Calculer les coins supérieur droit et inférieur gauche du temple du mur de gauche
        // mur avant la porte
        let doorMinZ = Math.min(...this._doorPositions.z);
        let doorMaxZ = Math.max(...this._doorPositions.z);
        let wallLeftBeforeDoorDistance = Math.abs(doorMinZ - this._spacingPillars + this.boxDepth/2)
        upperRightCorner = new Vector3(templeBox.position.x + wallLeftBeforeDoorDistance,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallLeftBeforeDoor = this.createWallV2(this.prefix + "wall_left_before_door", upperRightCorner, lowerLeftCorner);
        wallLeftBeforeDoor.position.x = templeBox.position.x - this.boxWidth/2;
        wallLeftBeforeDoor.rotation.y = Math.PI/2;
        wallLeftBeforeDoor.position.z = doorMinZ - this._spacingPillars - wallLeftBeforeDoorDistance/2;

        // mur après la porte
        let wallLeftAfterDoorDistance = Math.abs(doorMaxZ + this._spacingPillars - this.boxDepth/2);
        upperRightCorner = new Vector3(templeBox.position.x + wallLeftAfterDoorDistance,
            templeBox.position.y + this.pillarHeight - this.boxHeight/2, templeBox.position.z);
        lowerLeftCorner = new Vector3(templeBox.position.x,
            templeBox.position.y - this.boxHeight/2,templeBox.position.z);
        let wallLeftAfterDoor = this.createWallV2(this.prefix + "wall_left_after_door", upperRightCorner, lowerLeftCorner);
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
        }, this._scene);

        // Définir la position du mur
        wall.position.x = centerX;
        wall.position.y = centerY;
        wall.position.z = centerZ;
        wall.material = <StandardMaterial>this._wallMaterial;
        wall.parent = this.templeGroup;

        return wall;
    }

}
