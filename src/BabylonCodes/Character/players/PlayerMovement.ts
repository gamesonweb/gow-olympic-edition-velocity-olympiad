export interface PlayerMovement {
    movement_keys: { left: boolean, right: boolean, forward: boolean, back: boolean, jump: boolean };
    changeCallback(e: Event): void;
    mouseMove(e: MouseEvent): void;
    handleKeyDown(evt: KeyboardEvent): void;
    handleKeyUp(evt: KeyboardEvent): void;
    setupPointerLock(): void;
    setupMovement(): void;
}
