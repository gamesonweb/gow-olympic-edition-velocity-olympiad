import {
    Scene,
    Vector3,
    MeshBuilder,
    StandardMaterial,
    Color3,
    HemisphericLight,
    UniversalCamera,
    Mesh,
    KeyboardEventTypes,
    KeyboardInfo,
    PhysicsAggregate,
    PhysicsShapeType,
    Material,
    Ray,
    RayHelper
} from '@babylonjs/core';
import { PlayerInput } from './inputController';
import { Hud } from './ui';
import {SceneComponent} from "../../scenes/SceneComponent";
import {Nullable} from "@babylonjs/core/types";
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo";
import {State as PlayerState} from "./state";

export class Player extends SceneComponent{
    private mesh: Mesh;
    private isOnGround: boolean = true;
    private _ui: Hud;
    private _aggregate: PhysicsAggregate;
    private _light: HemisphericLight;
    private _camera: UniversalCamera;
    private _meshes: Mesh[] = [];
    private _materials: Material[] = [];
    private _input: PlayerInput;
    private readonly _scene: Scene;
    public readonly playerState: PlayerState;
    private _frontVector: Vector3;
    private _rightVector: Vector3;
    private _speed: number = .5;
    private _targetRotationY: number | null = null;



    constructor(playerState: PlayerState, scene: Scene){
        super();
        this._scene = scene;
        const ui = new Hud(scene);
        this._ui = ui;
        this._input = new PlayerInput(scene, ui);
        this.playerState = playerState;
        this._frontVector = new Vector3(0, 0, 1);
        this._rightVector = new Vector3(1, 0, 0);
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

    set rotation(rotation: Vector3) {
        this.mesh.rotation = rotation;
    }

    get speed(): number {
        return this._speed;
    }

    set speed(speed: number) {
        this._speed = speed;
    }


    public init(): void {
        this._createCamera();
        this._createLight();
        this._createPlayerMesh();
        this._setupPhysics();
        this._ui.init();
        this._input.init();
        // Update the player position and rotation based on the physics body
        this._scene.registerBeforeRender(this._callbackBeforeRenderScene.bind(this));
        // let interval = setInterval(() => {
        //     this._aggregate.body.applyImpulse(this._frontVector.scale(this._speed), this.position);
        //     console.log("applied impulse");
        // }, 1000);
        //
        // setTimeout(() => {
        //     clearInterval(interval);
        // }, 10000);
    }

    private _createLight(): void {
        this._light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);
    }

    private _createCamera(): void {
        this._camera = new UniversalCamera("FPS", new Vector3(0, 2, -10), this._scene);
        this._camera.attachControl(this._scene, true);
    }

    private _createPlayerMesh(): void {
        this.mesh = MeshBuilder.CreateBox("player", { size: 2 }, this._scene);
        this.mesh.position = new Vector3(0, 50, 0);
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
        if (!this.isOnGround) return;
        let direction = this._getCameraDirection();
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _moveBackward(): void {
        console.log("move backward on ground: ", this.isOnGround);
        if (!this.isOnGround) return; // Optional
        let direction = this._getCameraDirection().scale(-1);
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._aggregate.body.applyImpulse(direction.scale(this._speed), this.position);
    }

    private _moveRight(): void {
        if (!this.isOnGround) return;
        let direction: Vector3 = this._getCameraDirection().cross(Vector3.Down());
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._targetRotationY = this.rotation.y;
    }

    private _moveLeft(): void {
        if (!this.isOnGround) return;
        let direction: Vector3 = this._getCameraDirection().cross(Vector3.Up());
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this._targetRotationY = this.rotation.y;
    }

    private _jump(): void {
        if (!this.isOnGround) return;
        this._aggregate.body.applyImpulse(Vector3.Up().scale(this._speed*.5), this.position);
        this.isOnGround = false;
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
        let predicate = (mesh: Mesh) => {
            return mesh.isPickable && mesh.isEnabled() && mesh !== this.mesh;
        };

        let pick: Nullable<PickingInfo> = this._scene.pickWithRay(ray, predicate);
        // let rayHelper = new RayHelper(ray);
        // rayHelper.show(this._scene, new Color3(1, 0, 0)); // Affiche le rayon en rouge

        // console.log("pick: ", pick)
        if (pick && pick.hit) { //grounded
            return <Vector3>pick.pickedPoint;
        } else { //not grounded
            return Vector3.Zero();
        }
    }

    //raycast from the center of the player to check for whether player is grounded
    private  _isGrounded(): void {
        if (this._floorRaycast({x: 0, y: 1, z: 0}, 2).equals(Vector3.Zero())) {
            this.isOnGround = false;
        } else {
            this.isOnGround = true;
        }
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
                this._moveRight();
            } else {
                this._moveLeft();
            }
        }
        this._isGrounded();
        this._camera.position.x = this.position.x;
        this._camera.position.y = this.position.y + 2;
        this._camera.position.z = this.position.z;
        if (this._targetRotationY) {
            if (this._camera.rotation.y !== this._targetRotationY) {
                this._camera.rotation.y += (this._targetRotationY - this._camera.rotation.y) * 0.1; // Ajustez 0.1 pour contrôler la vitesse de l'interpolation
                if (Math.abs(this._camera.rotation.y - this._targetRotationY) <= 0.1) {
                    this._camera.rotation.y = this._targetRotationY;
                    this._targetRotationY = null;
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
}
