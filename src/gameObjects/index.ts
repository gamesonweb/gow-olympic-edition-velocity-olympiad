interface GameObject {
    canActOnCollision: boolean; // If true, the object will call onCollisionCallback() when it collides with another object
    canDetectCollision: boolean; // If true, the object will call detectCollision() to check for collisions with other objects
    onCollisionCallback (gameObject: GameObject): void;

    detectCollision(gameObjects: GameObject[]): void;

    updateState(): void;

}
