<template>
  <div id="app">
    <canvas id="renderCanvas"></canvas>
    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content">
        <img v-if="showImage" src="/game-intro.webp" alt="Game Intro" class="intro-image">
        <div v-else class="explanation-container">
          <p class="explanation-text">{{ visibleText }}</p>
        </div>

        <div class="steps">
          <p v-if="!assetsLoaded">Step 1: Téléchargement des assets ...</p>
          <p v-if="assetsLoaded && !playerReady">Step 2: Création du player ...</p>
        </div>
      </div>
      <div class="progress-bar-container">

      <div class="navigation-buttons">
        <button @click="prevPart" :disabled="currentPart === 0">Précédent</button>
        <button @click="nextPart" :disabled="currentPart === textParts.length - 1">Suivant</button>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth + '%' }"></div>
      </div>
        </div>
      <div class="button-container">
        <button
            :disabled="!isLoading"
            @click="startGame"
            :class="{ 'button-ready': isLoading }">
          <div v-if="!isLoading">
            <span>Chargement ...</span>
            <span class="loader"></span>
          </div>
          <span v-else>Commencer</span>
        </button>
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
      sceneManager: null as SceneManager | null,
      showOverlay: true,
      explanationText: `Bienvenue dans "Velocity Olympiad", une aventure épique au cœur de l'Antique Rome où

      vous incarnez le Flamme Éternelle, l'élu de la déesse Vesta. Vous avez été choisi pour une mission cruciale :

      ramener la lumière dans le cœur de Rome en rallumant les temples des dieux dispersés à travers l'empire,

      afin de permettre la tenue des Jeux Olympiques. Votre quête ne sera pas facile.

      Les forces de l'obscurité cherchent à éteindre la flamme sacrée à tout prix.

      Mais vous ne serez pas seul dans cette lutte. Vesta vous a accordé le pouvoir des cartes divines,

      des artefacts anciens contenant des bénédictions et des pouvoirs extraordinaires.

      À travers des épreuves de vitesse et de dextérité, vous devrez rassembler ces cartes disséminées dans l'empire

      et les utiliser avec sagesse pour surmonter les défis qui se dresseront sur votre chemin.

      Préparez-vous à vivre une aventure palpitante, où chaque choix que vous ferez aura un impact sur le destin de Rome

      et sur le succès des Jeux Olympiques. Serez-vous capable de relever le défi et de restaurer l'éclat des dieux ?

      C'est à vous de jouer, Flamme Éternelle.`,
      progressWidth: 0,
      assetsLoaded: false,
      playerReady: false,
      isLoading: false,
      showImage: true,
      visibleText: '',
      currentPart: 0,
      textParts: [] as string[],
    };
  },
  mounted() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const sceneManager = new SceneManager(canvas);
    this.sceneManager = sceneManager;

    const levelSelectorScene = new LevelSelectorScene(sceneManager.engine, sceneManager.playerState);

    levelSelectorScene.init().then(() => {
      sceneManager.renderScene();
    });

    const checkSceneStates = setInterval(() => {
      if (sceneManager.playerReady) {
        this.playerReady = true;
      }
      // console.log("Assets loaded: ", sceneManager.assetsLoaded, "Player ready: ", sceneManager.playerReady)
      if (sceneManager.assetsLoaded) {
        this.assetsLoaded = true;
      }
      if (this.assetsLoaded && this.playerReady) {
        this.isLoading = true;
        clearInterval(checkSceneStates);
      }
    }, 100);

    // Ensure canvas resizes with the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);

    setTimeout(() => {
      this.showImage = false;
      this.splitText();
      this.revealText();
      this.updateProgressBar(); // Mettre à jour la barre de progression après l'affichage du texte
    }, 2000);
  },
  methods: {
    startGame() {
      if (!this.assetsLoaded || !this.playerReady) {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000); // Adjust this timeout as needed to simulate loading
        return;
      }
      this.showOverlay = false;
      this.sceneManager?.startTimer();
    },
    splitText() {
      this.textParts = this.explanationText.split('\n\n');
    },
    revealText() {
      this.visibleText = this.textParts[this.currentPart];
    },
    nextPart() {
      if (this.currentPart < this.textParts.length - 1) {
        this.currentPart += 1;
        this.revealText();
        this.updateProgressBar(); // Mettre à jour la barre de progression
      }
    },
    prevPart() {
      if (this.currentPart > 0) {
        this.currentPart -= 1;
        this.revealText();
        this.updateProgressBar(); // Mettre à jour la barre de progression
      }
    },
    updateProgressBar() {
      this.progressWidth = ((this.currentPart + 1) / this.textParts.length) * 100;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  cursor: pointer;
}



.overlay-content {
  color: white;
  text-align: center;
  padding: 20px;
  max-width: 800px; /* Ensure content is centered and fits within the viewport */
  transition: opacity 1s ease-in-out;
}

.intro-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.explanation-container {
  width: 100%;
  margin-bottom: 20px;
}

.explanation-text {
  white-space: pre-line;
  font-size: 18px;
  margin-bottom: 20px;
  max-height: 300px; /* Adjust this to ensure visibility */
  overflow-y: auto;
}


.progress-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between; /* Aligne les éléments au début et à la fin du conteneur */
  margin-bottom: 20px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
  max-width: 800px; /* Taille maximale de la barre de progression */
}

.progress {
  height: 100%;
  background-color: #42b983;
  width: 0;
  transition: width 0.5s ease; /* Animation de la mise à jour de la largeur */
}

.steps {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay button:disabled {
  background-color: #333;
}

.loader {
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


#renderCanvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
