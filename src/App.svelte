<script>
  import {onMount, setContext} from "svelte";
  import {keyboard} from "./lib/input/keyboard.store.js"
  import {gameClock} from "./lib/clock/gameClock.store.js";
  import {pointerMove} from "./lib/input/pointermove.store.js";
  import Manifest from "./Manifest.svelte";
  import UI from "./UI.svelte";
  import {
    Engine,
    Scene,
    UniversalCamera,
    Vector3 as BVector3,
    HemisphericLight,
    MeshBuilder,
  } from "@babylonjs/core";

  /** @type Engine */
  let engine
  /** @type HTMLCanvasElement */
  let canvas
  /** @type Scene */
  let scene
  /** @type UniversalCamera */
  let camera

  setContext('game', /** @type GameContext */ {
    get engine() { return engine },
    get canvas() { return canvas },
    get scene() { return scene },
    get camera() { return camera },
  })

  onMount(() => {
    engine = new Engine(canvas.getContext('webgl2'), true)
    scene = new Scene(engine)

    camera = new UniversalCamera('camera', new BVector3(0, 5, -10), scene)
    camera.setTarget(BVector3.Zero())

    let light = new HemisphericLight('light', new BVector3(0, 1, 0), scene)
    light.intensity = 0.7

    let sphere = MeshBuilder.CreateSphere('sphere', {diameter: 2, segments: 32}, scene)
    sphere.position.y = 1

    let ground = MeshBuilder.CreateGround('ground', {width: 6, height: 6}, scene)

    setSize()

    engine.runRenderLoop(() => {
      gameClock.tick()
      scene.render()
    })
  })

  function setSize() {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    engine.resize()
  }
</script>

<UI />
<Manifest />

<svelte:window on:load={setSize} on:resize={setSize}/>

<canvas
  class="absolute top-0 left-0 bg-black z-[-1] touch-none focus:outline-0"
  bind:this={canvas}
  on:pointermove={pointerMove.bindToPointermove}
  on:keyup={keyboard.bindToKeyup}
  on:keydown={keyboard.bindToKeydown}
  on:click={() => canvas.requestPointerLock()}
  tabindex="1"
></canvas>

<style>
  canvas {
    -webkit-tap-highlight-color: transparent;
  }
</style>
