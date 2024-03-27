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
  import { FirstLevel } from "../BabylonCodes/scenes";
  import { WelcomeLevel } from "../BabylonCodes/levels/WelcomeLevel";
  import {TestTemple} from "./GameObjects/Temple/testTemple";
  export default defineComponent({
    name: 'BabylonCode',
    async mounted(){
        const canvas = document.querySelector('canvas')!;
        const game = new Main(canvas);
        game.Init().then(() => {
          // let testTemple = new TestTemple(game.getEngine(), game.getCanvas(), game.getPhysicsEngine());
          // game.getSceneManager().addScene(testTemple.our_scene);
          // let welcomeLevel: WelcomeLevel = new WelcomeLevel(game.getEngine(), game.getCanvas(), game.getPhysicsEngine());
          // game.getSceneManager().addScene(welcomeLevel.ourScene);
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
