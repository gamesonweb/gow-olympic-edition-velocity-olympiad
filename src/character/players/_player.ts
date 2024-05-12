import {
    AbstractMesh,
    Color3,
    HemisphericLight,
    Material,
    Mesh,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Quaternion,
    Ray,
    Scene,
    StandardMaterial,
    UniversalCamera,
    Vector3
} from '@babylonjs/core';
import {PlayerInput} from './inputController';
import {Hud} from './ui';
import {SceneComponent} from "../../scenes/SceneComponent";
import {Nullable} from "@babylonjs/core/types";
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo";
import {State as PlayerState} from "./state";
import {ICard} from "../../gameObjects/Card/ICard";
import {CardSocle} from "../../gameObjects/Card/CardSocle.ts";

export class Player extends SceneComponent implements GameObject{
    private mesh!: Mesh;
    private isOnGround: boolean = true;
    private _ui: Hud;
    private _aggregate!: PhysicsAggregate;
    private _light!: HemisphericLight;
    private _camera!: UniversalCamera;
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];
    private _input: PlayerInput;
    readonly _scene: Scene;
    public readonly playerState: PlayerState;
    private _speed: number = 1;
    private _jumpForce: number = 10;
    private _targetCamaraRotationY: number | null = null;
    private _slerpAmount: number = 0;
    private _cameraAttached: boolean = true;
    private _dashRate: number = 5; // dash speed equals speed * dashRate
    private _dashAvailable: boolean = false;
    private _initialPosition: Vector3;
    private _normalGravity: Vector3 = new Vector3(0, -6, 0);
    private _gravityScaleOnFalling: number = 2;
    private _isFallingGravitySet: boolean = false;

    public canActOnCollision: boolean = true;
    public canDetectCollision: boolean = true;

    constructor(playerState: PlayerState, scene: Scene){
        super();
        this._scene = scene;
        const ui = new Hud(scene);
        this._ui = ui;
        this._input = new PlayerInput(scene, ui);
        this.playerState = playerState;
        this._initialPosition = Vector3.Zero();
    }

    get cardList() {
        return this.playerState.cardList;
    }

    set cardList(cardList) {
        this.playerState.cardList = cardList;
    }

    get position(): Vector3 {
        return this.mesh.position;
    }

    set position(position: Vector3) {
        this.mesh.position = position;
    }

    get rotation(): Vector3 {
        return this.mesh.rotation;
    }

    public init(initialPosition?: Vector3): void {
        if (initialPosition) {
            this._initialPosition = initialPosition;
        }
        this._ui.init();
        this._input.init();
        this._createCamera();
        this._createLight();
        this._createPlayerMesh();
        this._setupPhysics();
        // Update the player position and rotation based on the physics body
        this._scene.registerBeforeRender(this._callbackBeforeRenderScene.bind(this));
    }

    public addCardToCart(card: ICard): void {
        this.cardList?.push(card);
        // this._ui.addCardToStackPanel(card)
        this._ui.updateCardsToStackPanel(this.cardList || []);
    }

    private _getActiveCard(): ICard | null {
        if (!this.cardList || this.cardList.length == 0) return null;
        return this.cardList?.pop() || null;
    }

    private _createLight(): void {
        this._light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);
    }

    private _createCamera(): void {
        this._camera = new UniversalCamera("FPS", new Vector3(0, 2, -10), this._scene);
        this._camera.attachControl(this._scene, true);
        if (this._ui.isMobile) {
            this._camera.touchAngularSensibility = 10000;
        }

    }

    private _createPlayerMesh(): void {
        this.mesh = MeshBuilder.CreateBox("player", { size: 2 }, this._scene);
        this.mesh.position = this._initialPosition;
        this.mesh.isVisible = true;
        const playerMaterial = new StandardMaterial("playerMaterial", this._scene);
        playerMaterial.diffuseColor = new Color3(0, 0, 1);
        // set the mesh transparent
        playerMaterial.alpha = 0.5;
        this.mesh.material = playerMaterial;
        this._meshes.push(this.mesh);
        this._materials.push(playerMaterial);
    }

    private _setupPhysics(): void {
        this._aggregate = new PhysicsAggregate(<Mesh>this.mesh, PhysicsShapeType.BOX, { mass: 1, friction: 0.5,
            restitution: 0.1 }, this._scene);
        this._aggregate.body.setCollisionCallbackEnabled(true);
    }

    private _moveForward(): void {
        let direction = this._getCameraDirection();
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _moveBackward(): void {
        let direction = this._getCameraDirection().scale(-1);
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _turnRight(): void {
        let direction: Vector3 = this._getCameraDirection().cross(Vector3.Down());
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _turnLeft(): void {
        let direction: Vector3 = this._getCameraDirection().cross(Vector3.Up());
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _jump(): void {
        if (!this.isOnGround) return;
        // Intensify the gravity to make the jump more realistic
        this._aggregate.body.applyImpulse(Vector3.Up().scale(this._jumpForce), this.position);
        this.isOnGround = false;
    }

    private _dash(): void {
        if (this.isOnGround) return;
        if (!this._dashAvailable) return;
        let direction = this._getCameraDirection();
        this._aggregate.body.applyImpulse(direction.scale(this._speed * this._dashRate), this.position);
        this._input.dashing = false;
        this._dashAvailable = false;
    }

    private _castSpell1(): void {
        // Cast spell 1 of the first card in the card list

        let card: ICard = this._getActiveCard() as ICard;
        if (!card) return;
        card.firstSpell(this._scene, this.position.clone());
        this._ui.updateCardsToStackPanel(this.cardList || []); // Update the UI
    }
    private _castSpell2(): void {
        // Cast spell 2

        let card: ICard = this._getActiveCard() as ICard;
        if (!card) return;
        card.secondSpell();
        this._ui.updateCardsToStackPanel(this.cardList || []); // Update the UI
    }

    private _getCameraDirection(): Vector3 {
        let forwardRay = this._camera.getForwardRay();
        let direction = forwardRay.direction.normalize();
        // S'assurer que le mouvement est seulement horizontal
        direction.y = 0;
        return direction;
    }

    //--GROUND DETECTION--
    //Send raycast to the floor to detect if there are any hits with meshes below the character
    private _floorRaycast(offsets: {x: Nullable<number>, y: Nullable<number>, z: Nullable<number>}, raycastlen: number): Vector3 {
        //position the raycast from bottom center of mesh
        let offsetx = offsets.x || 0;
        let offsety = offsets.y || 2.1; // La taille du mesh est 2, donc 2 / 2 + un petit delta
        let offsetz = offsets.z || 0;
        let raycastFloorPos = new Vector3(this.position.x + offsetx, this.position.y + offsety, this.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Down(), raycastlen);

        //defined which type of meshes should be pickable
        let predicate = (mesh: AbstractMesh) => {
            return mesh.isPickable && mesh.isEnabled() && mesh !== this.mesh;
        };

        let pick: Nullable<PickingInfo> = this._scene.pickWithRay(ray, predicate);
        // let rayHelper = new RayHelper(ray);
        // rayHelper.show(this._scene, new Color3(1, 0, 0)); // Affiche le rayon en rouge

        let pickedPointVector = Vector3.Zero();
        // console.log("pick: ", pick)
        if (pick && pick.hit) { //grounded
            pickedPointVector = <Vector3>pick.pickedPoint;
        }
        // rayHelper.dispose();
        return pickedPointVector;
    }

    //raycast from the center of the player to check for whether player is grounded
    private  _isGrounded(): void {
        let meshSize: number = this.mesh.getBoundingInfo().boundingBox.extendSize.y;
        if (this._floorRaycast({x: 0, y: meshSize*0.9, z: 0}, 2).equals(Vector3.Zero())) {
            this.isOnGround = false;
        } else {
            this.isOnGround = true;
            this._dashAvailable = true;
        }

    }

    private _isPlayerFalling(): boolean {
        return this._aggregate.body.getLinearVelocity().y < 0; // If velocity along Y-axis is negative, it's falling
    }

    private _callbackBeforeRenderScene(): void {
        if (this._input.jumpKeyDown) {
            this._jump();
        }
        if (this._input.verticalAxis != 0) {
            if (this._input.verticalAxis == 1) {
                this._moveForward();
            } else {
                this._moveBackward();
            }
        }
        if (this._input.horizontalAxis != 0) {
            if (this._input.horizontalAxis == 1) {
                this._turnRight();
            } else {
                this._turnLeft();
            }
        }
        if (this._input.dashing) {
            this._dash();
        }
        if (this._input.spell1) {
            this._castSpell1();
        }
        if (this._input.spell2) {
            this._input.spell2 = false;
            this._castSpell2();
        }
        this._isGrounded();
        this._updateCameraInfos();
        if (this._ui.gamePaused) {
            this._camera.detachControl();
            this._cameraAttached = false;
        } else {
            // Check is camera is detached
            if (!this._cameraAttached) {
                this._camera.attachControl(this._scene, true);
                this._cameraAttached = true;
            }
        }

        // Update gravity to initial gravity if player is grounded and not falling
        if (!this.isOnGround) {
            if (this._isPlayerFalling() && !this._isFallingGravitySet) {
                this._isFallingGravitySet = true;
                this._scene.getPhysicsEngine()?.setGravity(this._normalGravity.scale(this._gravityScaleOnFalling));
            }
        }else {
            if (this._isFallingGravitySet) {
                this._isFallingGravitySet = false;
                this._scene.getPhysicsEngine()?.setGravity(this._normalGravity);
            }
        }
        this._input.resetInputMap();
    }

    private _updateCameraInfos(): void {
        this._camera.position.x = this.position.x;
        this._camera.position.y = this.position.y + 2;
        this._camera.position.z = this.position.z;
        if (this._targetCamaraRotationY !== null) {
            // Supposons que targetQuaternion est défini correctement comme montré précédemment
            let targetQuaternion = Quaternion.RotationYawPitchRoll(this._targetCamaraRotationY, 0, 0);

            // Assurez-vous que la caméra utilise rotationQuaternion pour les rotations
            if (!this._camera.rotationQuaternion) {
                this._camera.rotationQuaternion = new Quaternion();
            }

            if (this._slerpAmount < 1) {
                this._slerpAmount += 0.03; // Incrémentez de 0.02 à chaque frame, ajustez selon les besoins pour la vitesse
                Quaternion.SlerpToRef(this._camera.rotationQuaternion, targetQuaternion, this._slerpAmount,
                    this._camera.rotationQuaternion);

                // Une fois que _slerpAmount atteint ou dépasse 1, arrêtez l'interpolation
                if (this._slerpAmount >= 1) {
                    this._targetCamaraRotationY = null;
                    this._slerpAmount = 0; // Réinitialisez pour la prochaine fois
                }
            }
        }
    }
    public destroy() {
        this._scene.onKeyboardObservable.clear();
        this._aggregate.dispose();
        this._light.dispose();
        this._camera.dispose();
        this._meshes.forEach(mesh => mesh.dispose());
        this._materials.forEach(material => material.dispose());
    }

    public detectCollision(gameObjects: GameObject[]): void {
        // console.log("Player can detect collision on: ", gameObjects);
    }

    public onCollisionCallback(gameObject: GameObject): void {
        console.log("Player collision detected", gameObject);
        if (gameObject instanceof CardSocle) {
            console.log("Card collision detected", gameObject);
            this.addCardToCart(gameObject.card);
        }
    }
}
