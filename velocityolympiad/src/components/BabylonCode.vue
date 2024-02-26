<template>
    <div>
        <h3>
            Babylon Code
        </h3>
        <canvas></canvas>
    </div>
</template>

  <script lang="ts">
  import { defineComponent } from 'vue';
  import {Main} from "../BabylonCodes/Main.ts";

  export default defineComponent({
    name: 'BabylonCode',
    async mounted(){
        const canvas = document.querySelector('canvas')!;
        const game = new Main(canvas);
        game.Init().then(() => {
          // setTimeout(() => {
          //   game.CreateScene();
          //   game.Run();
          // }, 1500);
          game.CreateScene(true);
          game.Run();
          game.test_water_fall()
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
