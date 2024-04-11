<template>
  <canvas></canvas>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SceneManager} from "./scenes/SceneManager";
//import {WelcomeScene} from "./scenes/WelcomeScene"
import {FirstLevelScene} from "./scenes/FirstLevelScene";

export default defineComponent({
  name: 'App',
  components: {},
  mounted() {

    const canvas = document.querySelector('canvas')!;

    let sceneManager = new SceneManager(canvas);

    /*let welcomeScene: WelcomeScene = new WelcomeScene(sceneManager.engine, sceneManager.playerState,
        sceneManager.guiStackPanel);*/

    let firstLevelScene: FirstLevelScene = new FirstLevelScene(sceneManager.engine, sceneManager.playerState,sceneManager.guiStackPanel);

    firstLevelScene.init().then(() => {
      sceneManager.renderScene();
    });
  }

});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

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
canvas {
  width: 100%;
  height: 100%;
}
</style>
