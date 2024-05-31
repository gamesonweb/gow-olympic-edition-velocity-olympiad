import {AdvancedDynamicTexture, Button, Control, Grid, Image, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {Effect, Engine, Scene, Sound} from "@babylonjs/core";
import {ICard} from "../../gameObjects/Card/ICard";
import {RareteCard} from "../../gameObjects/Card/RareteCard";
import {OlympiadScene} from "../../scenes/OlympiadScene.ts";
import {LevelSelectorScene} from "../../scenes/LevelSelectorScene";
import {PlayerState} from "./index.ts";

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
    // public spaceBtn!: Button;
    // keyboard
    public isAzerty: boolean | null = null;
    //Sounds
    private pauseSound!: Sound;
    private gameSound!: Sound;
    private _scene: Scene;
    private _clockTime: TextBlock | null = null; //GAME TIME
    private _startTime!: number;
    private _stopTimer!: boolean;

    //Animated UI sprites
    private _sparklerLife!: Image;
    private _playerUI!: AdvancedDynamicTexture;
    private _pauseMenu!: Rectangle;
    private _controls!: Rectangle;

    //ICard Menu
    private _cardMenuStackPanel!: StackPanel;
    private _activeCardStackPanel!: StackPanel;
    private _levelSelector!: Rectangle;
    private _winPanel!: Rectangle;

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

            //--SOUNDS--
            this.lauchPauseSound();
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
        this._createLevelSelectorMenu();
        this._createWinPanel();
        this._loadSounds(this._scene);
        this.startTimer();


        this._scene.onBeforeRenderObservable.add(() => {
            this.updateHud();
            this._disablePointerLockOnPause();
        });
        //Check if Mobile, add button controls
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.isMobile = true; // tells inputController to track mobile inputs

            this._prepareMobileScreen();

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
        let nameofCard = card.name;
        let stackUIImage = this._getStackUIImageFromRarete(card.rarete, nameofCard);
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
        let cardMeshName = card.name;
        let cardActiveText = new TextBlock("cardActiveText", `${cardMeshName}`);
        cardActiveText.color = "black";
        cardActiveText.fontSize = "18px";
        cardActiveText.paddingLeft = "5px"; // Espacement à gauche du nombre de cartes
        cardActiveText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        cardActiveText.height = "20px";
        this._activeCardStackPanel.addControl(cardActiveText);

        // show car durabilite
        let cardDurabiliteText = new TextBlock("cardDurabiliteText", `Durabilite: ${card.durabilite}`);
        cardDurabiliteText.color = "black";
        cardDurabiliteText.fontSize = "18px";
        cardDurabiliteText.paddingLeft = "5px"; // Espacement à gauche du nombre de cartes
        cardDurabiliteText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        cardDurabiliteText.height = "20px";
        this._activeCardStackPanel.addControl(cardDurabiliteText);


        let stackUIImage = this._getStackUIImageFromRarete(card.rarete, cardMeshName);
        let cardImage = new Image("card", stackUIImage);
        cardImage.width = "200px";
        cardImage.height = "300px";
        cardImage.paddingTop = "10px";
        cardImage.paddingTop = "5px";
        this._activeCardStackPanel.addControl(cardImage);
    }

    public updateHud(): void {
        if (!this._stopTimer && this._startTime != null) {
            let curTime = new Date().getTime() - this._startTime;

            // Convertir le temps écoulé en secondes et millisecondes
            let seconds = Math.floor(curTime / 1000);
            let milliseconds = curTime % 1000;

            milliseconds = Math.floor(milliseconds / 10); // Arrondir à deux chiffres

            // Mettre à jour le temps écoulé
            this.time = curTime;

            // Mettre à jour l'affichage
            // Formater les millisecondes avec trois chiffres
            let formattedMilliseconds = ("00" + milliseconds).slice(-2);
            this._clockTime!.text = `${seconds}.${formattedMilliseconds}`;
        }
    }


    //---- Game Timer ----
    public startTimer(): void {
        this._startTime = new Date().getTime();
        this._stopTimer = false;
    }

    public stopTimer(): void {
        this._stopTimer = true;
    }


    public GameOverOverlay(): void {

        this.gamePaused = true;
        this._disablePointerLockOnPause();
        this.pauseBtn.isVisible = false;

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
        // monter de 20px par rapport au centre
        gameOverText.top = "-50px";
        gameOverText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameOverOverlay.addControl(gameOverText);


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
            this.startCountdown();
        });

        // Automatically start countdown
        // this.startCountdown(countdownText);
    }

    updateHP(hp: number) {
        if (!hp) return
        this._sparklerLife.cellId = 10 - ((hp == 0) ? 0 : parseInt(`${hp / 10}`))
    }

    //---- Sparkler Timers ----

    public showWinPanel(): void {
        this._winPanel.isVisible = true;
        this._playerUI.addControl(this._winPanel);
        this._pauseMenu.isVisible = false;
        // Mettre le jeu en pause
        this.gamePaused = true;

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

    private _getStackUIImageFromRarete(rareteCard: RareteCard, nameofCard: string): string {

        let stackUIImage = "sprites/controls.jpeg"
        switch (rareteCard) {
            case RareteCard.COMMON:
                stackUIImage = "sprites/cardPreview/" + nameofCard + "Gray.png";
                break;
            case RareteCard.RARE:
                stackUIImage = "sprites/cardPreview/" + nameofCard + "Blue.png"
                break;
            case RareteCard.EPIC:
                stackUIImage = "sprites/cardPreview/" + nameofCard + "Purple.png";
                break;
            case RareteCard.LEGENDARY:
                stackUIImage = "sprites/cardPreview/" + nameofCard + "Gold.png";
                break;
        }
        return stackUIImage;
    }

    private _lockPointer(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this._scene.getEngine().getRenderingCanvas();
        canvas.onclick = () => {
            const requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;
            if (requestPointerLock) {
                requestPointerLock.call(canvas);


                // Créer et ajouter le cercle au centre de l'écran
                const circle = new Image("circle", "sprites/circle.png");
                circle.width = "40px";
                circle.height = "40px";
                circle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                circle.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
                this._playerUI.addControl(circle);
            }
        };
    }

    private _unlockPointer(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this._scene.getEngine().getRenderingCanvas();
        document.exitPointerLock();
        canvas.style.cursor = 'default';
        canvas.style.position = 'static';
        canvas.style.left = 'auto';
        canvas.style.top = 'auto';
        canvas.style.transform = 'none';


    }

    private _disablePointerLockOnPause(): void {
        if (this.gamePaused) {
            this._unlockPointer();
            this.stopTimer();
        } else {
            this._lockPointer();
        }
    }


    //---- Level selector Menu Popup ----

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
            // this._scene.getSoundByName("")!.play();
            this.lauchGameSound();

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

        });


        // restart button
        const restartBtn = Button.CreateSimpleButton("restart", "RESTART");
        restartBtn.width = 0.18;
        restartBtn.height = "44px";
        restartBtn.color = "white";
        restartBtn.fontFamily = "Viga";
        restartBtn.paddingBottom = "14px";
        restartBtn.cornerRadius = 14;
        restartBtn.fontSize = "12px";
        resumeBtn.textBlock!.resizeToFit = true;
        restartBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        restartBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        stackPanel.addControl(restartBtn);

        //when the button is down, make menu invisable and remove control of the menu
        restartBtn.onPointerDownObservable.add(() => {
            //open controls screen
            this.restartGame();
        });


        // level selection
        const levelBtn = Button.CreateSimpleButton("level", "LEVELS");
        levelBtn.width = 0.18;
        levelBtn.height = "44px";
        levelBtn.color = "white";
        levelBtn.fontFamily = "Viga";
        levelBtn.paddingBottom = "14px";
        levelBtn.cornerRadius = 14;
        levelBtn.fontSize = "12px";
        resumeBtn.textBlock!.resizeToFit = true;
        levelBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        levelBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        stackPanel.addControl(levelBtn);

        //when the button is down, make menu invisable and remove control of the menu
        levelBtn.onPointerDownObservable.add(() => {
            //open controls screen
            this._levelSelector.isVisible = true;
            this._pauseMenu.isVisible = false;

        });


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

        });
    }

    private _createWinPanel(): void {
        // Créer le panneau de victoire
        const winPanel = new Rectangle();
        winPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        winPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        winPanel.height = 1;
        winPanel.width = 1;
        winPanel.thickness = 0;
        winPanel.background = "#000000"; // Fond noir
        winPanel.color = "white";
        winPanel.isVisible = false;
        this._playerUI.addControl(winPanel);
        this._winPanel = winPanel;

        // Afficher le message "YOU WIN"
        const title = new TextBlock("title", "YOU WIN");
        title.resizeToFit = true;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        title.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.fontFamily = "Viga";
        title.fontSize = "48px";
        title.color = "white";
        winPanel.addControl(title);

        // Afficher le texte "Next level soon" et l'auteur
        const nextLevelText = new TextBlock("nextLevelText", "Next level soon\nby Samy Yassine & Jeff ");
        nextLevelText.resizeToFit = true;
        nextLevelText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        nextLevelText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        nextLevelText.fontFamily = "Arial";
        nextLevelText.fontSize = "24px";
        nextLevelText.color = "white";
        winPanel.addControl(nextLevelText);


    }

    private _createLevelSelectorMenu(): void {
        const levelSelector = new Rectangle();
        levelSelector.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        levelSelector.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        levelSelector.height = 0.8;
        levelSelector.width = 0.5;
        levelSelector.thickness = 0;
        levelSelector.color = "white";
        levelSelector.isVisible = false;
        this._playerUI.addControl(levelSelector);
        this._levelSelector = levelSelector;


        const title = new TextBlock("title", "LEVELS");
        title.resizeToFit = true;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        title.fontFamily = "Viga";
        title.fontSize = "32px";
        title.top = "14px";
        levelSelector.addControl(title);

        const backBtn = Button.CreateImageOnlyButton("back", "./sprites/lanternbutton.jpeg");
        backBtn.width = "40px";
        backBtn.height = "40px";
        backBtn.top = "14px";
        backBtn.thickness = 0;
        backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        backBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        levelSelector.addControl(backBtn);

        //when the button is down, make menu invisable and remove control of the menu
        backBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true;
            this._levelSelector.isVisible = false;

        });

        //level buttons
        const level1Btn = Button.CreateSimpleButton("level1", "LEVEL 1");
        level1Btn.width = 0.18;
        level1Btn.height = "44px";
        level1Btn.color = "white";
        level1Btn.fontFamily = "Viga";
        level1Btn.paddingBottom = "14px";
        level1Btn.cornerRadius = 14;
        level1Btn.fontSize = "12px";
        level1Btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        level1Btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        levelSelector.addControl(level1Btn);

        //when the button is down, make a new LevelSelectorScene and dispose actual scene
        level1Btn.onPointerDownObservable.add(() => {
            let actualScene = <OlympiadScene>this._scene;
            let playerState = new PlayerState()
            let nextScene = new LevelSelectorScene(actualScene.getEngine(), playerState);
            nextScene.init().then(() => {
                    actualScene.dispose();
                }
            );
        });


    }

// Function to start the countdown
    private startCountdown(): void {
        this.restartGame();

    }

// Function to restart the game
    private restartGame(): void {
        let olympiaScene = <OlympiadScene>this._scene;
        olympiaScene.restart();
        this.gamePaused = false;
    }

    //load all sounds needed for game ui interactions
    private _loadSounds(scene: Scene): void {
        this.gameSound = new Sound("game", "./sounds/game.wav", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0.1
        });
        this.pauseSound = new Sound("pause", "./sounds/pause.wav", scene, null, {
            loop: true,
            autoplay: false,
            volume: 0.1
        });
        if (Engine.audioEngine) {
            Engine.audioEngine.useCustomUnlockedButton = true;

            // Unlock audio on first user interaction.
            window.addEventListener(
                "click",
                () => {
                    if (Engine.audioEngine) {
                        if (!Engine.audioEngine.unlocked) {
                            Engine.audioEngine.unlock();
                        }
                    }
                },
                {once: true},
            );
        }


    }

    private lauchGameSound(): void {
        if (this.pauseSound.isPlaying) {
            this.pauseSound.stop();
        }
        if (!this.gameSound.isPlaying) {
            this.gameSound.play();
        }

    }

    private lauchPauseSound(): void {
        if (this.gameSound.isPlaying) {
            this.gameSound.stop();
        }
        if (!this.pauseSound.isPlaying) {
            this.pauseSound.play();
        }
    }

    private _prepareMobileScreen(): void {

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720;

        //popup for mobile to rotate screen
        const rect1 = new Rectangle();
        rect1.height = 0.2;
        rect1.width = 0.3;
        rect1.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect1.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        rect1.background = "white";
        rect1.alpha = 0.8;
        guiMenu.addControl(rect1);

        const rect = new Rectangle();
        rect.height = 0.2;
        rect.width = 0.3;
        rect.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        rect.color = "whites";
        guiMenu.addControl(rect);

        const stackPanel = new StackPanel();
        stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        rect.addControl(stackPanel);

        //image
        const image = new Image("rotate", "./sprites/rotate.png")
        image.width = 0.4;
        image.height = 0.6;
        image.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        rect.addControl(image);

        const alert = new TextBlock("alert", "For the best experience, please rotate your device");
        alert.fontSize = "16px";
        alert.fontFamily = "Viga";
        alert.color = "black";
        alert.resizeToFit = true;
        alert.textWrapping = true;
        stackPanel.addControl(alert);

        const closealert = Button.CreateSimpleButton("close", "X");
        closealert.height = "24px";
        closealert.width = "24px";
        closealert.color = "black";
        stackPanel.addControl(closealert);


        closealert.onPointerUpObservable.add(() => {
            guiMenu.removeControl(rect);
            guiMenu.removeControl(rect1);

            this._scene.getEngine().enterFullscreen(true);
        })
    }
}
