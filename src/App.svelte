<script>
  import {onMount} from "svelte";
  import {gameClock} from "./lib/stores/gameClock.store.js";
  import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
  import {pointerLock} from "./lib/stores/pointerLock.store.js";
  import {userInput} from "./lib/stores/userInput.store.js"
  import {
    BoxGeometry,
    DirectionalLight,
    Mesh, MeshBasicMaterial,
    MeshToonMaterial, PerspectiveCamera,
    PlaneGeometry, Scene,
    Vector3,
    WebGLRenderer
  } from "three";

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
    renderer = new WebGLRenderer({canvas});
    camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    setSize()

    const scene =  new Scene()
    const boxGeo = new BoxGeometry(2,2,2,2)
    const boxMat = new MeshBasicMaterial({color: 0x00ff00})
    const box = new Mesh(boxGeo, boxMat)
    scene.add(box)

    const planeGeo = new PlaneGeometry(3, 3)
    const planeMat = new MeshToonMaterial()
    const plane = new Mesh(planeGeo, planeMat)
    scene.add(plane)

    const light = new DirectionalLight(0xffffff, 0.5)
    scene.add(light)

    const loader = new GLTFLoader();
    const data = await loader.loadAsync('/src/assets/scene.gltf', (event) => console.log(event))
    scene.add(data.scene)

    camera.rotation.order = "YXZ"
    camera.position.z = 6;

    gameClock.subscribe(() => {
      const dir = camera.getWorldDirection(new Vector3())
      if ($userInput.has('w')) {
        const relativeForward = dir.clone()
        camera.position.addScaledVector(
            new Vector3(relativeForward.x, 0, relativeForward.z), 0.05
        )
      }
      if ($userInput.has('s')) {
        const relativeBack = dir.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI)
        camera.position.addScaledVector(
            new Vector3(relativeBack.x, 0, relativeBack.z), 0.05
        )
      }
      if ($userInput.has('a')) {
        const relativeLeft = dir.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
        camera.position.addScaledVector(
            new Vector3(relativeLeft.x, 0, relativeLeft.z), 0.05
        )
      }
      if ($userInput.has('d')) {
        const relativeRight = dir.clone().applyAxisAngle(new Vector3(0, 1, 0), (3 * Math.PI) / 2)
        camera.position.addScaledVector(
            new Vector3(relativeRight.x, 0, relativeRight.z), 0.05
        )
      }
      if ($userInput.has(' ')) {
        camera.position.y += 0.05
      }
      if ($userInput.has('Control')) {
        camera.position.y -= 0.05
      }

      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box.rotation.z += 0.01;
      renderer.render(scene, camera)
    })
  })

  /** @param event {PointerEvent} */
  function onpointermove(event) {
    if (!$pointerLock) return
    camera.rotation.set(
        camera.rotation.x -= (event.movementY * 0.005),
        camera.rotation.y -= (event.movementX * 0.005),
        0
    )
  }
</script>

<svelte:window on:load={setSize} on:resize={setSize}/>

<h1>{$gameClock}</h1>
<h3>Camera</h3>

<div class="ml-5">
  <span>Rotation:</span>
  <span><b>X: </b>{camera?.getWorldDirection(new Vector3()).x.toFixed(3)}</span>
  <span><b>Y: </b>{camera?.getWorldDirection(new Vector3()).y.toFixed(3)}</span>
  <span><b>Z: </b>{camera?.getWorldDirection(new Vector3()).z.toFixed(3)}</span>
</div>

<div class="ml-5">
  <span>Position:</span>
  <span><b>X: </b>{camera?.position.x.toFixed(3)}</span>
  <span><b>Y: </b>{camera?.position.y.toFixed(3)}</span>
  <span><b>Z: </b>{camera?.position.z.toFixed(3)}</span>
</div>

<button
  class="rounded border-white border-2"
  on:click={() => document.body.requestFullscreen()}
>Fullscreen</button>

<canvas
  class="absolute top-0 left-0 bg-black z-[-1] touch-none focus:outline-0"
  bind:this={canvas}
  on:pointermove={onpointermove}
  on:keyup={userInput.bindToKeyup}
  on:keydown={userInput.bindToKeydown}
  on:mousedown={() => canvas.requestPointerLock()}
  tabindex="1"
></canvas>

<style>
  canvas {
    -webkit-tap-highlight-color: transparent;
  }
</style>
