import {ActionManager, ExecuteCodeAction, Scalar, Scene} from '@babylonjs/core';
import {Hud} from './ui';

export class PlayerInput {

    public inputMap: any;
    private active: boolean = true;
    //simple movement
    public horizontal: number = 0;
    public vertical: number = 0;
    //tracks whether or not there is movement in that axis
    public horizontalAxis: number = 0;
    public verticalAxis: number = 0;
    //jumping and dashing
    public jumpKeyDown: boolean = false;
    public dashing: boolean = false;
    // spell casting
    public spell1: boolean = false;
    public spell2: boolean = false;
    public mobileLeft: boolean = false;
    public mobileRight: boolean = false;
    public mobileUp: boolean = false;
    public mobileDown: boolean = false;
    private readonly _scene: Scene;
    //Mobile Input trackers
    private _ui: Hud;
    private _mobileJump: boolean = false;
    private _mobileDash: boolean = false;

    //keyboard caracters default to azerty
    private _keyboardUpCaracter: string = "z";
    private _keyboardDownCaracter: string = "s"
    private _keyboardLeftCaracter: string = "q";
    private _keyboardRightCaracter: string = "d";

    constructor(scene: Scene, ui: Hud) {

        this._scene = scene;
        this._ui = ui;
    }

    public init(): void {
        //scene action manager to detect inputs
        this._scene.actionManager = new ActionManager(this._scene);
        if (!this.active) return;
        this.inputMap = {};
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));


        //add to the scene an observable that calls updateFromKeyboard before rendering
        this._scene.onBeforeRenderObservable.add(() => {
            this._updateFromKeyboard();
        });

        // Set up Mobile Controls if on mobile device
        if (this._ui.isMobile) {
            this._setUpMobile();
        }

        // Set up the keyboard controls
        this._setKeyboardCaracters();
    }

    public resetInputMap(): void {
        this.inputMap = {};
    }

    // public desactivateInputs(): void {
    //     this.active = false;
    //     this.init();
    // }

    // Keyboard controls & Mobile controls

    private _setKeyboardCaracters(): void {
        if (this._ui.isAzerty) {
            this._keyboardUpCaracter = "z";
            this._keyboardDownCaracter = "s";
            this._keyboardLeftCaracter = "q";
            this._keyboardRightCaracter = "d";
        } else {
            this._keyboardUpCaracter = "w";
            this._keyboardDownCaracter = "s";
            this._keyboardLeftCaracter = "a";
            this._keyboardRightCaracter = "d";
        }
    }

    //handles what is done when keys are pressed or if on mobile, when buttons are pressed
    private _updateFromKeyboard(): void {

        //forward - backwards movement
        if ((this.inputMap["ArrowUp"] || this.inputMap[this._keyboardUpCaracter] || this.mobileUp) && !this._ui.gamePaused) {
            this.verticalAxis = 1;
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);

        } else if ((this.inputMap["ArrowDown"] || this.inputMap[this._keyboardDownCaracter] || this.mobileDown) && !this._ui.gamePaused) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        //left - right movement
        if ((this.inputMap["ArrowLeft"] || this.inputMap[this._keyboardLeftCaracter] || this.mobileLeft) && !this._ui.gamePaused) {
            //lerp will create a scalar linearly interpolated amt between start and end scalar
            //taking current horizontal and how long you hold, will go up to -1(all the way left)
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;

        } else if ((this.inputMap["ArrowRight"] || this.inputMap[this._keyboardRightCaracter] || this.mobileRight) && !this._ui.gamePaused) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
        } else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }

        //dash
        if ((this.inputMap["Shift"] || this._mobileDash) && !this._ui.gamePaused) {
            this.dashing = true;
        } else {
            this.dashing = false;
        }

        //Jump Checks (SPACE)
        if ((this.inputMap[" "] || this._mobileJump) && !this._ui.gamePaused) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }
        // First Spell cast (a key)
        this.spell1 = !!this.inputMap["a"];
        // Second Spell cast (e key)
        this.spell2 = !!this.inputMap["e"];
    }

    // Mobile controls
    private _setUpMobile(): void {
        //Jump Button
        this._ui.jumpBtn.onPointerDownObservable.add(() => {
            this._mobileJump = true;
        });
        this._ui.jumpBtn.onPointerUpObservable.add(() => {
            this._mobileJump = false;
        });

        //Dash Button
        this._ui.dashBtn.onPointerDownObservable.add(() => {
            this._mobileDash = true;
        });
        this._ui.dashBtn.onPointerUpObservable.add(() => {
            this._mobileDash = false;
        });

        //Arrow Keys
        this._ui.leftBtn.onPointerDownObservable.add(() => {
            this.mobileLeft = true;
        });
        this._ui.leftBtn.onPointerUpObservable.add(() => {
            this.mobileLeft = false;
        });

        this._ui.rightBtn.onPointerDownObservable.add(() => {
            this.mobileRight = true;
        });
        this._ui.rightBtn.onPointerUpObservable.add(() => {
            this.mobileRight = false;
        });

        this._ui.upBtn.onPointerDownObservable.add(() => {
            this.mobileUp = true;
        });
        this._ui.upBtn.onPointerUpObservable.add(() => {
            this.mobileUp = false;
        });

        this._ui.downBtn.onPointerDownObservable.add(() => {
            this.mobileDown = true;
        });
        this._ui.downBtn.onPointerUpObservable.add(() => {
            this.mobileDown = false;
        });
    }
}
