<script>
  import {onMount} from "svelte";
  import {keyboard} from "./lib/input/keyboard.store.js"
  import * as THREE from 'three'
  import Plane from "./game/Plane.svelte";
  import DroppedCube from "./game/DroppedCube.svelte";
  import {scene} from "./lib/graphics/scene.js";
  import {gameClock} from "./lib/clock/gameClock.store.js";
  import Light from "./game/Light.svelte";
  import {currentCamera} from "./lib/graphics/currentCamera.store.js";
  import Camera from "./game/Camera.svelte";
  import {pointerMove} from "./lib/input/pointermove.store.js";
  import Manifest from "./Manifest.svelte";

  /** @type THREE.WebGLRenderer */
  let renderer
  /** @type HTMLCanvasElement */
  let canvas

  onMount(() => {
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true

    setSize()

    renderer.setAnimationLoop((time) => {
      gameClock.tick(time)
      if ($currentCamera) {
        renderer.render(scene, $currentCamera)
      }
    })
  })

  function setSize() {
    renderer.setSize(window.innerWidth, window.innerHeight)

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    if ($currentCamera) {
      $currentCamera.aspect = window.innerWidth / window.innerHeight
      $currentCamera.updateProjectionMatrix()
    }
  }

</script>

<Manifest/>

<svelte:window on:load={setSize} on:resize={setSize}/>

<h1>Frame Time: {$gameClock?.toFixed(3)}ms</h1>

<button
  class="rounded border-white border-2"
  on:click={() => document.body.requestFullscreen()}
>Fullscreen</button>

<canvas
  class="absolute top-0 left-0 bg-black z-[-1] touch-none focus:outline-0"
  bind:this={canvas}
  on:pointermove={pointerMove.bindToPointermove}
  on:keyup={keyboard.bindToKeyup}
  on:keydown={keyboard.bindToKeydown}
  on:mousedown={() => canvas.requestPointerLock()}
  tabindex="1"
></canvas>

<style>
  canvas {
    -webkit-tap-highlight-color: transparent;
  }
</style>
