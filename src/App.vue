<template>
  <canvas id="renderCanvas"></canvas>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SceneManager} from "./scenes/SceneManager";
import {LevelSelectorScene} from "./scenes/LevelSelectorScene"

export default defineComponent({
  name: 'App',
  components: {},
  mounted() {

    const canvas = document.querySelector('canvas')!;

    let sceneManager = new SceneManager(canvas);

    let _scene2: LevelSelectorScene = new LevelSelectorScene(sceneManager.engine, sceneManager.playerState);


    _scene2.init().then(() => {
      sceneManager.renderScene();
    });

    // Ensure canvas resizes with the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      console.log("Resized canvas to " + canvas.width + "x" + canvas.height);
      console.log("Window is " + window.innerWidth + "x" + window.innerHeight);
    };

    // Initial resize
    resizeCanvas();

    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
  }

});
</script>

<style scoped>
/*
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*/
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
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
</style>
