<template>
    <div>
        <h3>
            Babylon Code
        </h3>
        <canvas></canvas>
    </div>
</template>

  <script lang="ts">
  import {defineComponent} from 'vue';
  import {Main} from "../BabylonCodes/Main.ts";

  import {FirstLevel} from "../BabylonCodes/levels/FirstLevel";
  import {WelcomeLevel} from "../BabylonCodes/levels/WelcomeLevel";

  export default defineComponent({
    name: 'BabylonCode',
    mounted(){
        const canvas = document.querySelector('canvas')!;
        const game = new Main(canvas);
        game.Init().then(() => {
          let firstLevel: FirstLevel = new FirstLevel(game);
          let welcomelevel : WelcomeLevel = new WelcomeLevel(game);
          console.log(game.getSceneManager().scenes);
          game.getSceneManager().addScene(firstLevel.ourScene);
          console.log(game.getSceneManager().scenes);
          game.getSceneManager().addScene(welcomelevel.ourScene);
          console.log(game.getSceneManager().scenes);
          game.Run();
        });
    }
  });
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
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
