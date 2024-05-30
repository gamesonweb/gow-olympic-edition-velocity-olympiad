## Fonctionnalités du jeu :

- [x] **Système de cartes divines** : collectionnez des cartes offrant des capacités uniques pour surmonter les obstacles.
- [x] **Rallumez les temples des dieux** : explorez l'empire romain pour restaurer la gloire des Jeux Olympiques.

## Technologies utilisées :
- [x] Vite.js
- [x] Babylon.js

## Inspirations
- [x] **Projet SummerFestival de Babylon.js** ([SummerFestival sur GitHub](https://github.com/BabylonJS/SummerFestival)) : Nous nous sommes inspirés de :
    - La gestion des entrées utilisateurs (input)
    - La gestion de l'interface utilisateur (UI)
    - La jouabilité du jeu sur mobile

- [x] **Anciens projets GOW** : Nous avons consulté le GitHub des anciens projets GOW pour avoir une idée de la structure des fichiers à adopter pour notre projet.

## Défis techniques
- [x] **Gestion des collisions entre objets** : Initialement, la gestion des collisions entre deux objets était simple. Cependant, lorsque nous avons dû gérer les collisions entre les boules de feu des ennemis, les boules de feu du joueur et la destruction des objets, cela est devenu difficile à maintenir. Nous avons résolu ce problème en créant une interface GameObject avec les méthodes suivantes :
    - `canActOnCollision: boolean` : Indique si l'objet doit appeler `onCollisionCallback()` en cas de collision.
    - `canDetectCollision: boolean` : Indique si l'objet doit appeler `detectCollision()` pour vérifier les collisions.
    - `onCollisionCallback(gameObject: GameObject): void`
    - `detectCollision(gameObjects: GameObject[]): void`
      Tous les GameObjects sont inscrits dans une scène Olympiad (étendant la scène Babylon). Avant chaque rendu de la scène, si un GameObject a `canDetectCollision` à true, sa méthode `detectCollision()` est appelée.
- [x] **Gestion du moteur physique** : Nous avons découvert que le moteur physique ne pouvait pas être transféré d'une scène à une autre. Pour chaque nouvelle scène, nous avons donc créé un nouveau moteur physique, tout en conservant le moteur Babylon existant. De plus, lorsqu'un mesh est déplacé via `applyImpulse` du moteur physique, il n'était pas possible de redéfinir sa position, rendant les mouvements peu pratiques pour le joueur. La solution a été de contrôler la vélocité maximale (`max vitesse`) des déplacements.

