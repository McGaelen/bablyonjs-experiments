<script>
  import * as THREE from 'three'
  import {onMount} from "svelte";
  import {gameClock} from "./lib/stores/gameClock.js";

  /** @type HTMLCanvasElement */
  let canvas
  /** @type THREE.WebGLRenderer */
  let renderer
  /** @type THREE.PerspectiveCamera */
  let camera

  function setSize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
  }

  onMount(async () => {
    renderer = new THREE.WebGLRenderer({canvas});
    camera = new THREE.PerspectiveCamera(
        75, 1, 0.1, 1000
    )
    setSize()

    const scene =  new THREE.Scene()
    const boxGeo = new THREE.BoxGeometry(2,2,2,2)
    const boxMat = new THREE.MeshBasicMaterial({color: 0x00ff00})
    const box = new THREE.Mesh(boxGeo, boxMat)
    scene.add(box)

    const planeGeo = new THREE.PlaneGeometry(3, 3)
    const planeMat = new THREE.MeshToonMaterial()
    const plane = new THREE.Mesh(planeGeo, planeMat)
    scene.add(plane)

    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    scene.add(light)

    camera.position.z = 6;

    gameClock.subscribe(() => {
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box.rotation.z += 0.01;
      renderer.render(scene, camera)
    })
  })

  /** @param event {PointerEvent} */
  function onpointermove(event) {
    if (document.pointerLockElement === canvas) {
      camera.rotation.set(
          camera.rotation.x += (event.movementY * 0.005),
          camera.rotation.y += (event.movementX * 0.005),
          camera.rotation.z
      )
    }
  }
</script>

<svelte:window on:load={setSize} on:resize={setSize}/>
\
<h1>{$gameClock}</h1>
<button on:click={() => document.body.requestFullscreen()}>Fullscreen</button>

<!-- TODO: could use combo of keyup/keydown to record if a key is currently held, -->
<!-- TODO: without depending on the key repeat rate of the user's OS. -->
<canvas
  bind:this={canvas}
  on:pointermove={onpointermove}
  on:keypress={(event) => {
    console.log(event)
  }}
  on:mousedown={() => canvas.requestPointerLock()}
  tabindex="1"
></canvas>

<style>
  h1 {
    font-family: sans-serif;
    color: white;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    z-index: -1;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>