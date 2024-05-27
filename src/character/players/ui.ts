import {AdvancedDynamicTexture, Button, Control, Grid, Image, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {Effect, ParticleSystem, PostProcess, Scene, Sound} from "@babylonjs/core";
import {ICard} from "../../gameObjects/Card/ICard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";

export class Hud {
    //Game Timer
    public time!: number; //keep track to signal end game REAL TIME
    //Timer handlers
    public stopSpark!: boolean;
    //Pause toggle
    public gamePaused!: boolean;
    //Quit game
    public quit!: boolean;
    public transition: boolean = false;
    //UI Elements
    public pauseBtn!: Button;
    public fadeLevel!: number;
    public tutorial!: Rectangle;
    public hint!: Rectangle;
    //Mobile
    public isMobile!: boolean;
    public jumpBtn!: Button;
    public dashBtn!: Button;
    public leftBtn!: Button;
    public rightBtn!: Button;
    public upBtn!: Button;
    public downBtn!: Button;
    //Sounds
    public quitSfx!: Sound;
    // keyboard
    public isAzerty: boolean | null = null;
    private _scene: Scene;
    private _prevTime: number = 0;
    private _clockTime: TextBlock | null = null; //GAME TIME
    private _startTime!: number;
    private _stopTimer!: boolean;
    private _sString = "00";
    private _mString = 11;
    private _lanternCnt!: TextBlock;
    //Animated UI sprites
    private _sparklerLife!: Image;
    private _spark!: Image;
    private _handle!: NodeJS.Timeout;
    private _sparkhandle!: NodeJS.Timeout;
    private _playerUI!: AdvancedDynamicTexture;
    private _pauseMenu!: Rectangle;
    private _controls!: Rectangle;
    private _sfx!: Sound;
    private _pause!: Sound;
    private _sparkWarningSfx!: Sound;
    //ICard Menu
    private _cardMenuStackPanel!: StackPanel;
    private _activeCardStackPanel!: StackPanel;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public init(): void {
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._playerUI = playerUI;
        this._playerUI.idealHeight = 720;
        if (this.isAzerty === null) {
            // load from local storage if available
            // unless check from language
            this.isAzerty = navigator.language === "fr-FR";
        }

        const lanternCnt = new TextBlock();
        lanternCnt.name = "Piece count";
        lanternCnt.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        lanternCnt.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        lanternCnt.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        lanternCnt.fontSize = "22px";
        lanternCnt.color = "white";
        lanternCnt.text = "Pièces: 1 / 22";
        lanternCnt.top = "32px";
        lanternCnt.left = "-64px";
        lanternCnt.width = "25%";
        lanternCnt.fontFamily = "Viga";
        lanternCnt.resizeToFit = true;
        playerUI.addControl(lanternCnt);
        this._lanternCnt = lanternCnt;

        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.top = "14px";
        stackPanel.verticalAlignment = 0;
        playerUI.addControl(stackPanel);

        //Game timer text
        const clockTime = new TextBlock();
        clockTime.name = "clock";
        clockTime.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        clockTime.fontSize = "48px";
        clockTime.color = "white";
        clockTime.text = "11:00";
        clockTime.resizeToFit = true;
        clockTime.height = "96px";
        clockTime.width = "220px";
        clockTime.fontFamily = "Viga";
        stackPanel.addControl(clockTime);
        this._clockTime = clockTime;

        //sparkler bar animation
        const sparklerLife = new Image("sparkLife", "./sprites/sparkLife.png");
        sparklerLife.width = "54px";
        sparklerLife.height = "162px";
        sparklerLife.cellId = 0;
        sparklerLife.cellHeight = 108;
        sparklerLife.cellWidth = 36;
        sparklerLife.sourceWidth = 36;
        sparklerLife.sourceHeight = 108;
        sparklerLife.horizontalAlignment = 0;
        sparklerLife.verticalAlignment = 0;
        sparklerLife.left = "14px";
        sparklerLife.top = "14px";
        playerUI.addControl(sparklerLife);
        this._sparklerLife = sparklerLife;

        const spark = new Image("spark", "./sprites/spark.png");
        spark.width = "40px";
        spark.height = "40px";
        spark.cellId = 0;
        spark.cellHeight = 20;
        spark.cellWidth = 20;
        spark.sourceWidth = 20;
        spark.sourceHeight = 20;
        spark.horizontalAlignment = 0;
        spark.verticalAlignment = 0;
        spark.left = "21px";
        spark.top = "20px";
        playerUI.addControl(spark);
        this._spark = spark;

        const pauseBtn = Button.CreateImageOnlyButton("pauseBtn", "./sprites/pauseBtn.png");
        pauseBtn.width = "48px";
        pauseBtn.height = "86px";
        pauseBtn.thickness = 0;
        pauseBtn.verticalAlignment = 0;
        pauseBtn.horizontalAlignment = 1;
        pauseBtn.top = "-16px";
        playerUI.addControl(pauseBtn);
        pauseBtn.zIndex = 10;
        this.pauseBtn = pauseBtn;
        //when the button is down, make pause menu visable and add control to it
        pauseBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true;
            playerUI.addControl(this._pauseMenu);
            this.pauseBtn.isHitTestVisible = false;

            //when game is paused, make sure that the next start time is the time it was when paused
            this.gamePaused = true;
            this._prevTime = this.time;

            //--SOUNDS--
            // this._scene.getSoundByName("gameSong")!.pause();
            // this._pause.play(); //play pause music
        });

        //popup tutorials + hint
        const tutorial = new Rectangle();
        tutorial.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tutorial.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        tutorial.top = "12%";
        tutorial.left = "-1%";
        tutorial.height = 0.2;
        tutorial.width = 0.2;
        tutorial.thickness = 0;
        tutorial.alpha = 0.6;
        this._playerUI.addControl(tutorial);
        this.tutorial = tutorial;
        //movement image, will disappear once you attempt all of the moves
        let movementPC = new Image("pause", "sprites/tutorial.jpeg");
        tutorial.addControl(movementPC);

        const hint = new Rectangle();
        hint.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        hint.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        hint.top = "14%";
        hint.left = "-4%";
        hint.height = 0.08;
        hint.width = 0.08;
        hint.thickness = 0;
        hint.alpha = 0.6;
        hint.isVisible = false;
        this._playerUI.addControl(hint);
        this.hint = hint;
        //hint to the first lantern, will disappear once you light it
        const lanternHint = new Image("lantern1", "sprites/arrowBtn.png");
        lanternHint.rotation = Math.PI / 2;
        lanternHint.stretch = Image.STRETCH_UNIFORM;
        lanternHint.height = 0.8;
        lanternHint.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        hint.addControl(lanternHint);
        const moveHint = new TextBlock("move", "Move Right");
        moveHint.color = "white";
        moveHint.fontSize = "12px";
        moveHint.fontFamily = "Viga";
        moveHint.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        moveHint.textWrapping = true;
        moveHint.resizeToFit = true;
        hint.addControl(moveHint);

        this._createPauseMenu();
        this._createControlsMenu();
        this._loadSounds(this._scene);

        this._lockPointer();
        this.startTimer();
        this._scene.onBeforeRenderObservable.add(() => {
            this.updateHud();
            this._disablePointerLockOnPause();
        });
        //Check if Mobile, add button controls
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.isMobile = true; // tells inputController to track mobile inputs

            //tutorial image
            movementPC.isVisible = false;
            let movementMobile = new Image("pause", "sprites/tutorialMobile.jpeg");
            tutorial.addControl(movementMobile);
            //--ACTION BUTTONS--
            // container for action buttons (right side of screen)
            const actionContainer = new Rectangle();
            actionContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            actionContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            actionContainer.height = 0.4;
            actionContainer.width = 0.2;
            actionContainer.left = "-2%";
            actionContainer.top = "-2%";
            actionContainer.thickness = 0;
            playerUI.addControl(actionContainer);

            //grid for action button placement
            const actionGrid = new Grid();
            actionGrid.addColumnDefinition(.5);
            actionGrid.addColumnDefinition(.5);
            actionGrid.addRowDefinition(.5);
            actionGrid.addRowDefinition(.5);
            actionContainer.addControl(actionGrid);

            const dashBtn = Button.CreateImageOnlyButton("dash", "./sprites/aBtn.png");
            dashBtn.thickness = 0;
            dashBtn.alpha = 0.8;
            dashBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this.dashBtn = dashBtn;

            const jumpBtn = Button.CreateImageOnlyButton("jump", "./sprites/bBtn.png");
            jumpBtn.thickness = 0;
            jumpBtn.alpha = 0.8;
            jumpBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.jumpBtn = jumpBtn;

            actionGrid.addControl(dashBtn, 0, 1);
            actionGrid.addControl(jumpBtn, 1, 0);

            //--MOVEMENT BUTTONS--
            // container for movement buttons (section left side of screen)
            const moveContainer = new Rectangle();
            moveContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            moveContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            moveContainer.height = 0.4;
            moveContainer.width = 0.4;
            moveContainer.left = "2%";
            moveContainer.top = "-2%";
            moveContainer.thickness = 0;
            playerUI.addControl(moveContainer);

            //grid for placement of arrow keys
            const grid = new Grid();
            grid.addColumnDefinition(.4);
            grid.addColumnDefinition(.4);
            grid.addColumnDefinition(.4);
            grid.addRowDefinition(.5);
            grid.addRowDefinition(.5);
            moveContainer.addControl(grid);

            const leftBtn = Button.CreateImageOnlyButton("left", "./sprites/arrowBtn.png");
            leftBtn.thickness = 0;
            leftBtn.rotation = -Math.PI / 2;
            leftBtn.color = "white";
            leftBtn.alpha = 0.8;
            leftBtn.width = 0.8;
            leftBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.leftBtn = leftBtn;

            const rightBtn = Button.CreateImageOnlyButton("right", "./sprites/arrowBtn.png");
            rightBtn.rotation = Math.PI / 2;
            rightBtn.thickness = 0;
            rightBtn.color = "white";
            rightBtn.alpha = 0.8;
            rightBtn.width = 0.8;
            rightBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this.rightBtn = rightBtn;

            const upBtn = Button.CreateImageOnlyButton("up", "./sprites/arrowBtn.png");
            upBtn.thickness = 0;
            upBtn.alpha = 0.8;
            upBtn.color = "white";
            this.upBtn = upBtn;

            const downBtn = Button.CreateImageOnlyButton("down", "./sprites/arrowBtn.png");
            downBtn.thickness = 0;
            downBtn.rotation = Math.PI;
            downBtn.color = "white";
            downBtn.alpha = 0.8;
            this.downBtn = downBtn;

            //arrange the buttons in the grid
            grid.addControl(leftBtn, 1, 0);
            grid.addControl(rightBtn, 1, 2);
            grid.addControl(upBtn, 0, 1);
            grid.addControl(downBtn, 1, 1);

        }

        this._createICardMenu();
    }

    /**
     * @deprecated This function will be removed in future versions. Use updateCardsStackPanel instead.
     */
    public addCardsToStackPanel(cards: ICard[]): void {
        return this.updateCardsToStackPanel(cards);
    }

    public updateCardsToStackPanel(cards: ICard[]): void {
        this._cardMenuStackPanel.clearControls();
        let cardCountText = new TextBlock("cardCountText", `${cards.length}`);
        cardCountText.color = "black";
        cardCountText.fontSize = "32px";
        cardCountText.paddingLeft = "5px"; // Espacement à gauche du nombre de cartes
        cardCountText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        cardCountText.height = "40px";
        this._cardMenuStackPanel.addControl(cardCountText);
        if (cards.length > 0) {
            let activeCardPosition = cards.length - 1;
            let card = cards[activeCardPosition];
            this.activeCard(card);
            if (activeCardPosition > 0) {
                let previousCard = cards[activeCardPosition - 1];
                this.addCardToStackPanel(previousCard, 0);
            }
        } else {
            this._activeCardStackPanel.clearControls();
            this._cardMenuStackPanel.clearControls();
        }


    }

    public addCardToStackPanel(card: ICard, index = 0): Control | undefined {
        if (index > 0) {
            return;
        }
        let stackUIImage = this._getStackUIImageFromRarete(card.rarete);
        let cardImage = new Image("card", stackUIImage);
        let width = "100px";
        let height = "150px";
        let paddingTop = (index == 0) ? "10px" : "0px";
        let paddingBottom = (index == 0) ? "5px" : "0px";
        let left = (index == 0) ? "0px" : index * -10 + "px";

        cardImage.width = width; // La largeur de la carte
        cardImage.height = height; // La hauteur de la carte
        cardImage.paddingTop = paddingTop; // Espacement entre les cartes
        cardImage.paddingTop = paddingBottom; // Espacement entre les cartes
        cardImage.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        cardImage.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        cardImage.left = left;
        this._cardMenuStackPanel.addControl(cardImage);
        return cardImage;
    }

    public activeCard(card: ICard): void {
        this._activeCardStackPanel.clearControls();
        let cardMeshName = card.meshname.split(".")[0];
        let cardActiveText = new TextBlock("cardActiveText", `${cardMeshName}`);
        cardActiveText.color = "black";
        cardActiveText.fontSize = "18px";
        cardActiveText.paddingLeft = "5px"; // Espacement à gauche du nombre de cartes
        cardActiveText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        cardActiveText.height = "20px";
        this._activeCardStackPanel.addControl(cardActiveText);
        let stackUIImage = this._getStackUIImageFromRarete(card.rarete);
        let cardImage = new Image("card", stackUIImage);
        cardImage.width = "200px";
        cardImage.height = "300px";
        cardImage.paddingTop = "10px";
        cardImage.paddingTop = "5px";
        this._activeCardStackPanel.addControl(cardImage);
    }

    public updateHud(): void {
        if (!this._stopTimer && this._startTime != null) {
            let curTime = Math.floor((new Date().getTime() - this._startTime) / 1000) + this._prevTime; // divide by 1000 to get seconds

            this.time = curTime; //keeps track of the total time elapsed in seconds
            // this._clockTime!.text = this._formatTime(curTime);
            this._clockTime!.text = ("0" + this._formatTime(curTime)).slice(-8);
        }
    }

    public updateLanternCount(numLanterns: number): void {
        this._lanternCnt.text = "Lanterns: " + numLanterns + " / 22";
    }

    //---- Game Timer ----
    public startTimer(): void {
        this._startTime = new Date().getTime();
        this._stopTimer = false;
    }

    public stopTimer(): void {
        this._stopTimer = true;
    }

    //start and restart sparkler, handles setting the texture and animation frame
    public startSparklerTimer(sparkler: ParticleSystem): void {
        //reset the sparkler timers & animation frames
        this.stopSpark = false;
        this._sparklerLife.cellId = 0;
        this._spark.cellId = 0;
        if (this._handle) {
            clearInterval(this._handle);
        }
        if (this._sparkhandle) {
            clearInterval(this._sparkhandle);
        }
        //--SOUNDS--
        this._sparkWarningSfx.stop(); // if you restart the sparkler while this was playing (it technically would never reach cellId==10, so you need to stop the sound)

        //reset the sparkler (particle system and light)
        if (sparkler != null) {
            sparkler.start();
            this._scene.getLightByName("sparklight")!.intensity = 35;
        }

        //sparkler animation, every 2 seconds update for 10 bars of sparklife
        this._handle = setInterval(() => {
            if (!this.gamePaused) {
                if (this._sparklerLife.cellId < 10) {
                    this._sparklerLife.cellId++;
                }
                if (this._sparklerLife.cellId == 9) {
                    this._sparkWarningSfx.play();
                }
                if (this._sparklerLife.cellId == 10) {
                    this.stopSpark = true;
                    clearInterval(this._handle);
                    //sfx
                    this._sparkWarningSfx.stop();
                }
            } else { // if the game is paused, also pause the warning SFX
                this._sparkWarningSfx.pause();
            }
        }, 2000);

        this._sparkhandle = setInterval(() => {
            if (!this.gamePaused) {
                if (this._sparklerLife.cellId < 10 && this._spark.cellId < 5) {
                    this._spark.cellId++;
                } else if (this._sparklerLife.cellId < 10 && this._spark.cellId >= 5) {
                    this._spark.cellId = 0;
                } else {
                    this._spark.cellId = 0;
                    clearInterval(this._sparkhandle);
                }
            }
        }, 185);
    }

    //stop the sparkler, resets the texture
    public stopSparklerTimer(sparkler: ParticleSystem): void {
        this.stopSpark = true;

        if (sparkler != null) {
            sparkler.stop();
            this._scene.getLightByName("sparklight")!.intensity = 0;
        }
    }

    private _createICardMenu(): void {
        this._cardMenuStackPanel = new StackPanel("cardMenuStackPanel");
        this._cardMenuStackPanel.width = "180px"; // La largeur du stack panel
        this._cardMenuStackPanel.isVertical = true; // Alignement vertical des cartes
        this._cardMenuStackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._cardMenuStackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._cardMenuStackPanel.left = "-230px"
        this._cardMenuStackPanel.rotation = -Math.PI / 18;
        this._playerUI.addControl(this._cardMenuStackPanel);

        this._activeCardStackPanel = new StackPanel("activeCardStackPanel");
        this._activeCardStackPanel.width = "150px";
        this._activeCardStackPanel.isVertical = true;
        this._activeCardStackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._activeCardStackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        // this._activeCardStackPanel.rotate(Axis.Z, -Math.PI / 18); // Inclinaison légère du StackPanel
        // this._activeCardStackPanel.rotation = -Math.PI / 18;
        this._activeCardStackPanel.left = "-10px"; // Ajuster la position à gauche par rapport au centre du StackPanel des cartes du menu
        this._playerUI.addControl(this._activeCardStackPanel);
        this._playerUI.addControl(this._activeCardStackPanel);
    }

    private _getStackUIImageFromRarete(rareteCard: RareteCard): string {
        console.log(rareteCard)
        let stackUIImage = "sprites/controls.jpeg"
        switch (rareteCard) {
            case RareteCard.COMMON:
                stackUIImage = "sprites/cardPreview/TorchTextureGray.png";
                break;
            case RareteCard.RARE:
                stackUIImage = "sprites/cardPreview/TorchTextureBlue.png"
                break;
            case RareteCard.EPIC:
                stackUIImage = "sprites/cardPreview/TorchTexturePurple.png";
                break;
            case RareteCard.LEGENDARY:
                stackUIImage = "sprites/cardPreview/TorchTextureGold.png";
                break;
        }
        return stackUIImage;
    }

    private _lockPointer(): void {
        // When the element is clicked, request pointer lock
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this._scene.getEngine().getRenderingCanvas();
        canvas.onclick = function () {
            let requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;
            if (requestPointerLock) {
                console.log("requestPointerLock exists")
                canvas.requestPointerLock = requestPointerLock;
                // Ask the browser to lock the pointer
                canvas.requestPointerLock();
            } else {
                console.log("Pointer lock not supported");
            }
        };
    }

    //---- Sparkler Timers ----

    private _disablePointerLockOnPause(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this._scene.getEngine().getRenderingCanvas();
        if (this.gamePaused) {
            canvas.requestPointerLock = () => {
            };
            this.stopTimer();
        } else {
            if (document.pointerLockElement !== canvas) {
                this._lockPointer();
            }
        }
    }

    //format the time so that it is relative to 11:00 -- game time
    private _formatTime(time: number): string {
        let minsPassed = Math.floor(time / 60); //seconds in a min
        let secPassed = time % 240; // goes back to 0 after 4mins/240sec
        //gameclock works like: 4 mins = 1 hr
        // 4sec = 1/15 = 1min game time
        if (secPassed % 4 == 0) {
            // this._mString = Math.floor(minsPassed / 4) + 11;
            this._mString = Math.floor(minsPassed / 4);
            this._sString = (secPassed / 4 < 10 ? "0" : "") + secPassed / 4;
        }
        let day = (this._mString == 11 ? " PM" : " AM");
        return (this._mString + ":" + this._sString + day);
    }

    //---- Pause Menu Popup ----
    private _createPauseMenu(): void {
        this.gamePaused = false;

        const pauseMenu = new Rectangle();
        pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        pauseMenu.height = 0.8;
        pauseMenu.width = 0.5;
        pauseMenu.thickness = 0;
        pauseMenu.isVisible = false;

        //background image
        const image = new Image("pause", "sprites/pause.jpeg");
        pauseMenu.addControl(image);

        //stack panel for the buttons
        const stackPanel = new StackPanel();
        stackPanel.width = .83;
        pauseMenu.addControl(stackPanel);

        const resumeBtn = Button.CreateSimpleButton("resume", "RESUME");
        resumeBtn.width = 0.18;
        resumeBtn.height = "44px";
        resumeBtn.color = "white";
        resumeBtn.fontFamily = "Viga";
        resumeBtn.paddingBottom = "14px";
        resumeBtn.cornerRadius = 14;
        resumeBtn.fontSize = "12px";
        resumeBtn.textBlock!.resizeToFit = true;
        resumeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(resumeBtn);

        this._pauseMenu = pauseMenu;

        //when the button is down, make menu invisable and remove control of the menu
        resumeBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = false;
            this._playerUI.removeControl(pauseMenu);
            this.pauseBtn.isHitTestVisible = true;

            //game unpaused, our time is now reset
            this.gamePaused = false;
            this._startTime = new Date().getTime();

            //--SOUNDS--
            // this._scene.getSoundByName("gameSong")!.play();
            // this._pause.stop();

            // if(this._sparkWarningSfx.isPaused) {
            //     this._sparkWarningSfx.play();
            // }
            // this._sfx.play(); //play transition sound
        });

        const controlsBtn = Button.CreateSimpleButton("controls", "CONTROLS");
        controlsBtn.width = 0.18;
        controlsBtn.height = "44px";
        controlsBtn.color = "white";
        controlsBtn.fontFamily = "Viga";
        controlsBtn.paddingBottom = "14px";
        controlsBtn.cornerRadius = 14;
        controlsBtn.fontSize = "12px";
        resumeBtn.textBlock!.resizeToFit = true;
        controlsBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        controlsBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        stackPanel.addControl(controlsBtn);

        //when the button is down, make menu invisable and remove control of the menu
        controlsBtn.onPointerDownObservable.add(() => {
            //open controls screen
            this._controls.isVisible = true;
            this._pauseMenu.isVisible = false;

            //play transition sound
            this._sfx.play();
        });

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.18;
        quitBtn.height = "44px";
        quitBtn.color = "white";
        quitBtn.fontFamily = "Viga";
        quitBtn.paddingBottom = "12px";
        quitBtn.cornerRadius = 14;
        quitBtn.fontSize = "12px";
        resumeBtn.textBlock!.resizeToFit = true;
        quitBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        quitBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(quitBtn);

        //set up transition effect
        Effect.RegisterShader("fade",
            "precision highp float;" +
            "varying vec2 vUV;" +
            "uniform sampler2D textureSampler; " +
            "uniform float fadeLevel; " +
            "void main(void){" +
            "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
            "baseColor.a = 1.0;" +
            "gl_FragColor = baseColor;" +
            "}");
        this.fadeLevel = 1.0;

        quitBtn.onPointerDownObservable.add(() => {
            const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this._scene.getCameraByName("cam"));
            postProcess.onApply = (effect) => {
                effect.setFloat("fadeLevel", this.fadeLevel);
            };
            this.transition = true;

            //--SOUNDS--
            this.quitSfx.play();
            if (this._pause.isPlaying) {
                this._pause.stop();
            }
        })
    }

    //---- Controls Menu Popup ----
    private _createControlsMenu(): void {
        const controls = new Rectangle();
        controls.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        controls.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        controls.height = 0.8;
        controls.width = 0.5;
        controls.thickness = 0;
        controls.color = "white";
        controls.isVisible = false;
        this._playerUI.addControl(controls);
        this._controls = controls;

        //background image
        const image = new Image("controls", "sprites/controls.jpeg");
        controls.addControl(image);

        const title = new TextBlock("title", "CONTROLS");
        title.resizeToFit = true;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        title.fontFamily = "Viga";
        title.fontSize = "32px";
        title.top = "14px";
        controls.addControl(title);

        const backBtn = Button.CreateImageOnlyButton("back", "./sprites/lanternbutton.jpeg");
        backBtn.width = "40px";
        backBtn.height = "40px";
        backBtn.top = "14px";
        backBtn.thickness = 0;
        backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        backBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        controls.addControl(backBtn);

        //when the button is down, make menu invisable and remove control of the menu
        backBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true;
            this._controls.isVisible = false;

            //play transition sound
            this._sfx.play();
        });
    }

    public GameOverOverlay(): void {
        // make cursor unlock
        // document.exitPointerLock();

        // Create a rectangle to overlay the entire screen
        const gameOverOverlay = new Rectangle("gameOverOverlay");
        gameOverOverlay.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameOverOverlay.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        gameOverOverlay.height = 1;
        gameOverOverlay.width = 1;
        gameOverOverlay.color = "black";
        gameOverOverlay.alpha = 0.7; // Semi-transparent black
        this._playerUI.addControl(gameOverOverlay);

        // Add text displaying "Game Over"
        const gameOverText = new TextBlock("gameOverText");
        gameOverText.text = "Game Over";
        gameOverText.color = "rgb(46,199,192)";
        gameOverText.fontSize = "72px";
        gameOverText.fontFamily = "Viga";
        gameOverText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        gameOverText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameOverOverlay.addControl(gameOverText);

        // Add a countdown timer
        const countdownText = new TextBlock("countdownText");
        countdownText.text = "";
        countdownText.color = "rgb(46,199,192)";
        countdownText.fontSize = "48px";
        countdownText.fontFamily = "Viga";
        countdownText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        countdownText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        countdownText.top = "80px"; // Position it below the "Game Over" text
        gameOverOverlay.addControl(countdownText);

        // Add a button to restart the game
        const restartButton = Button.CreateSimpleButton("restart", "Restart Now");
        restartButton.width = "250px";
        restartButton.height = "100px";
        restartButton.color = "black";
        restartButton.fontFamily = "Viga";
        restartButton.fontSize = "48px";
        restartButton.cornerRadius = 10;
        restartButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        restartButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        restartButton.paddingBottom = "20px";
        gameOverOverlay.addControl(restartButton);

        // Event listener for restart button
        restartButton.onPointerUpObservable.add(() => {
            this.startCountdown(countdownText);
        });

        // Automatically start countdown
        // this.startCountdown(countdownText);
    }

// Function to start the countdown
    private startCountdown(countdownText: TextBlock): void {
        let countdown = 3;
        countdownText.text = `Restarting in ${countdown}...`;

        const intervalId = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownText.text = `Restarting in ${countdown}...`;
            } else {
                clearInterval(intervalId);
                countdownText.text = "Restarting now...";
                this.restartGame();
            }
        }, 1000);
    }

// Function to restart the game
    private restartGame(): void {
        this.gamePaused = true;
        this._disablePointerLockOnPause();
        let olympiaScene = <OlympiadScene>this._scene;
        olympiaScene.restart();
    }


    //load all sounds needed for game ui interactions
    private _loadSounds(scene: Scene): void {
        this._pause = new Sound("pauseSong", "./sounds/Snowland.wav", scene, function () {
        }, {
            volume: 0.2
        });

        this._sfx = new Sound("selection", "./sounds/vgmenuselect.wav", scene, function () {
        });

        this.quitSfx = new Sound("quit", "./sounds/Retro Event UI 13.wav", scene, function () {
        });

        this._sparkWarningSfx = new Sound("sparkWarning", "./sounds/Retro Water Drop 01.wav", scene, function () {
        }, {
            loop: true,
            volume: 0.5,
            playbackRate: 0.6
        });
    }

    updateHP(hp: number) {
        console.log("updateHP", hp)

    }
}
