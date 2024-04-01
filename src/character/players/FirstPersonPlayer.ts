/**
 * Character interface
 * Crete the structure of the character
 * camera: Camera
 * attach came to the character
 */

import { Player} from "./index";
import { PlayerState } from "./PlayerState";
import {Scene, Mesh, UniversalCamera, Vector3, HemisphericLight} from "@babylonjs/core";

export class FirstPersonPlayer extends Player {
    private _playerState: PlayerState;
    private _meshes: Mesh[] = [];
    private _camera: UniversalCamera;
    private _light: HemisphericLight;
    private readonly  _scene: Scene;

    constructor(playerState: PlayerState, scene: Scene){
        super();
        this._playerState = playerState;
        this._scene = scene;
    }

    get cardList() {
        return this._playerState.cardList;
    }

   set cardList(cardList) {
        this._playerState.cardList = cardList;
   }

    public init(){
        this._createCamera();
        this._createLight();
    }

    private _createLight(): void {
        this._light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);
    }

    private _createCamera(): void {
        this._camera = new UniversalCamera("FPS", new Vector3(0, 2, 0));
        this._camera.attachControl(this._scene, true);
    }


    destroy() {
        super.destroy();
        this._meshes.forEach(mesh => mesh.dispose());
    }
}
