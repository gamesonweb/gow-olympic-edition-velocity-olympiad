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
  import {OurScene} from "../BabylonCodes/scenes";
  import {TestCard} from "./GameObjects/Card/TestCard.ts";
  
  export default defineComponent({
    name: 'BabylonCode',
    mounted(){
        const canvas = document.querySelector('canvas')!;
        const game = new Main(canvas);
        game.Init().then(() => {
          setTimeout(() => {

            let scene = new TestCard(game.getEngine(), game.getCanvas(), game.getPhysicsEngine());

            game.getSceneManager().addScene(scene.our_scene);
            game.Run();
          }, 1500);
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
  