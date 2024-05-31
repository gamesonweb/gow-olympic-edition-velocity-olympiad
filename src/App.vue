<template>
  <div id="app">
    <canvas id="renderCanvas"></canvas>
    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content">
        <p class="explanation-text">{{ explanationText }}</p>
        <button @click="startGame">Commencer</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SceneManager} from "./scenes/SceneManager";
import {LevelSelectorScene} from './scenes/LevelSelectorScene';


export default defineComponent({
  name: 'App',
  data() {
    return {
      showOverlay: true,
      explanationText: `Bienvenue dans "Velocity Olympiad", une aventure épique au cœur de l'Antique Rome où vous incarnez le Flamme Éternelle, l'élu de la déesse Vesta. Vous avez été choisi pour une mission cruciale : ramener la lumière dans le cœur de Rome en rallumant les temples des dieux dispersés à travers l'empire, afin de permettre la tenue des Jeux Olympiques.

Votre quête ne sera pas facile. Les forces de l'obscurité cherchent à éteindre la flamme sacrée à tout prix. Mais vous ne serez pas seul dans cette lutte. Vesta vous a accordé le pouvoir des cartes divines, des artefacts anciens contenant des bénédictions et des pouvoirs extraordinaires. À travers des épreuves de vitesse et de dextérité, vous devrez rassembler ces cartes disséminées dans l'empire et les utiliser avec sagesse pour surmonter les défis qui se dresseront sur votre chemin.

Préparez-vous à vivre une aventure palpitante, où chaque choix que vous ferez aura un impact sur le destin de Rome et sur le succès des Jeux Olympiques. Serez-vous capable de relever le défi et de restaurer l'éclat des dieux ? C'est à vous de jouer, Flamme Éternelle.`
    };
  },
  mounted() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const sceneManager = new SceneManager(canvas);


    const levelSelectorScene = new LevelSelectorScene(sceneManager.engine, sceneManager.playerState);


    levelSelectorScene.init().then(() => {
    levelSelectorScene.init().then(() => {
      sceneManager.renderScene();
    });


    // Ensure canvas resizes with the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


    };

    // Initial resize
    resizeCanvas();

    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
  },
  methods: {
    startGame() {
      this.showOverlay = false;
    }
  }
});
</script>

<style scoped>
#app {
  position: relative;
  width: 100%;
  height: 100vh;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-content {
  color: white;
  text-align: center;
  padding: 20px;
}

.explanation-text {
  white-space: pre-line;
  font-size: 18px;
  margin-bottom: 20px;
}

body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  display: block;
}

.overlay button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
