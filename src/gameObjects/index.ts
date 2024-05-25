interface GameObject {
    canActOnCollision: boolean; // If true, the object will call onCollisionCallback() when it collides with another object
    canDetectCollision: boolean; // If true, the object will call detectCollision() to check for collisions with other objects
    detectCollision(gameObjects: GameObject[]): void;
    onCollisionCallback: (gameObject: GameObject) => void;
}
