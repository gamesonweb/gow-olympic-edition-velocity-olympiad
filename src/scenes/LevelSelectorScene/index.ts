import {
    Engine,
    HDRCubeTexture,
    Material,
    Mesh,
    MeshBuilder,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShapeMesh,
    SceneLoader,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {OlympiadScene} from "../OlympiadScene";
import {FirstLevelEnemyManager} from "./enemyManager";
import {Player, PlayerState} from "../../character/players";
import {TempleV2} from "../../gameObjects/TempleV2";
import {EnemyManager} from "../EnemyManager.ts";
import {Sign} from "../../gameObjects/Sign/index.ts";

export class LevelSelectorScene extends OlympiadScene {
    protected readonly enemyManager: EnemyManager;
    // noinspection JSUnusedGlobalSymbols
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];

    constructor(engine: Engine, playerState: PlayerState) {

        super(engine);
        this.engine = engine;
        this.enemyManager = new FirstLevelEnemyManager(this);
        this.addComponent(this.enemyManager); // Ainsi, le manager sera détruit avec la scène

        this.player = new Player(playerState, this);
    }

    public async init(): Promise<void> {
        await super.init();
        this.player.init(new Vector3(0, 50, -80));
        this.enemyManager.init();
        await this._buildlevelStatic();
        this.addComponent(this.player);
        this.addGameObject(this.player);
    }

    public onPauseState() {
        return
    }

    public onResumeState() {
        return
    }

    public destroy(): void {
        this._meshes.forEach((mesh) => mesh.dispose());
        this._materials.forEach((material) => material.dispose());
        super.destroy();
    }

    public restart() {
        let newScene = new LevelSelectorScene(this.getEngine(), this.player.playerState)
        newScene.init().then(() => {
            this.destroy()
        });
    }

    private _buildlevelStatic(): void {
        SceneLoader.ImportMesh("", "models/", "SelectLevelScene.glb", this, (meshes) => {
            const root = meshes[0];
            root.position = new Vector3(0, 0, 0);
            root.rotation = new Vector3(0, 0, 0);
            root.scaling = new Vector3(1, 1, 1);
            const childrens = root.getChildren();

            for (let child of childrens) {
                const mesh = child as Mesh;
                mesh.renderingGroupId = 2;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, this);
                body.shape = new PhysicsShapeMesh(mesh, this)
            }
            // new PhysicsAggregate(root, PhysicsShapeType.BOX, {mass: 0}, this);
        });

        //Adding a Skybox

        const skybox = MeshBuilder.CreateBox("skyBox", {size: 1024}, this);
        skybox.renderingGroupId = 0;
        const skyboxMaterial = new StandardMaterial("skyBox", this);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = new HDRCubeTexture("textures/skybox/skybox.hdr", this, 512);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;

        const temple = new TempleV2(this, new Vector3(125, 37, 157), new Vector3(0, -110 * (Math.PI / 180.0), 0), new Vector3(1, 1, 1), this.engine);
        this.addComponent(temple);

        //Signs 

        let signs = [
            {text: "Appuiez sur ZQSD pour vous Deplacer", position: new Vector3(0, 8.5, -78)},
            {text: "Appuiez sur \"Espace\" pour Sauter", position: new Vector3(-1.7, 8.5, -35)},
            {text: "Appuiez sur \"Maj Gauche\" pour vous propulser dans les airs", position: new Vector3(-92, 22, 91)},
            {
                text: "Ceci est un Pouvoir de Vitesse \n Appuiez sur \"E\" Afin d'accomplir un Double Saut , Vous pouvez l'uiliser autant de fois que ça durabilité vous le permet",
                position: new Vector3(-95, 29, 188)
            },
            {
                text: "Les Pouvoirs \n possèdent aussi une utilisation Consommant toute leur durabilité d'un coup appuiez sur \"A\" \nAvec ce Pouvoir de vitesse pour augementer votre vitesse de Déplacement pendant un cours Laps de temps",
                position: new Vector3(-43, 58, 196)
            },
            {
                text: "Voici La Torche, celle-ci permet d'envoyer des boules de feu avec son \"A\" et d'effectuer une propulstion capable de battre des ennemis avec \"E\"",
                position: new Vector3(78, 88, 273)
            },
            {
                text: "Une fois être rentré dans le temple, votre but va être de raviver la Flamme dans le temple de l'olympe",
                position: new Vector3(190, 88, 320)
            },
        ];

        signs.forEach(element => {
            let sign = new Sign(element.text, element.position, this);
            this.addComponent(sign);
        });


    }
}
