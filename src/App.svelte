<script>
  import {onMount} from "svelte";
  import {pointerLock} from "./lib/stores/pointerLock.store.js";
  import {userInput} from "./lib/stores/userInput.store.js"
  import * as THREE from 'three'
  import RAPIER from "@dimforge/rapier3d-compat";
  import {setContext} from 'svelte'
  import Plane from "./lib/Plane.svelte";


  /** @type THREE.WebGLRenderer */
  let renderer
  /** @type THREE.Scene */
  let scene
  /** @type RAPIER.World */
  let physics
  setContext('game', {
    get renderer() { return renderer },
    get scene() { return scene },
    get physics() { return physics }
  })

  /** @type HTMLCanvasElement */
  let canvas
  /** @type THREE.PerspectiveCamera */
  let camera

  onMount(async () => {
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true
    physics = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
    scene = new THREE.Scene()


    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.rotation.order = "YXZ"
    camera.position.z = 7
    camera.position.y = -5
    camera.rotation.x = -0.7
    setSize()



    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.0, 1.0, 0.0)
    let rigidBody = physics.createRigidBody(rigidBodyDesc)
    let colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
    let collider = physics.createCollider(colliderDesc, rigidBody)
    rigidBody.applyTorqueImpulse(new RAPIER.Vector3(
        Math.random() * -3, Math.random() * -3, Math.random() * -3), true)
    const boxGeo = new THREE.BoxGeometry(2,2,2)
    const boxMat = new THREE.MeshToonMaterial({color: 0xff0000})
    const box = new THREE.Mesh(boxGeo, boxMat)
    box.castShadow = true
    scene.add(box)




    const light = new THREE.DirectionalLight(0xffffff, 0.7)
    light.castShadow = true
    light.position.set(0, 15, -7)
    scene.add(light)




    let prevTime = 0
    renderer.setAnimationLoop((time) => {
      const delta = time - prevTime
      const dir = camera.getWorldDirection(new THREE.Vector3())

      physics.timestep = delta / 1000
      physics.step()


      let rotation = rigidBody.rotation()


      if ($userInput.has('w')) {
        const relativeForward = dir.clone()
        camera.position.addScaledVector(
            new THREE.Vector3(relativeForward.x, 0, relativeForward.z), 0.005 * delta
        )
      }
      if ($userInput.has('s')) {
        const relativeBack = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
        camera.position.addScaledVector(
            new THREE.Vector3(relativeBack.x, 0, relativeBack.z), 0.005 * delta
        )
      }
      if ($userInput.has('a')) {
        const relativeLeft = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
        camera.position.addScaledVector(
            new THREE.Vector3(relativeLeft.x, 0, relativeLeft.z), 0.005 * delta
        )
      }
      if ($userInput.has('d')) {
        const relativeRight = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (3 * Math.PI) / 2)
        camera.position.addScaledVector(
            new THREE.Vector3(relativeRight.x, 0, relativeRight.z), 0.005 * delta
        )
      }
      if ($userInput.has(' ')) {
        camera.position.y += 0.005 * delta
      }
      if ($userInput.has('q')) {
        camera.position.y -= 0.005 * delta
      }


      // box.rotation.x = rotation.x
      // box.rotation.y = rotation.y
      // box.rotation.z = rotation.z
      const quat = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
      box.rotation.setFromQuaternion(quat)
      box.position.x = rigidBody.translation().x
      box.position.y = rigidBody.translation().y
      box.position.z = rigidBody.translation().z


      prevTime = time
      renderer.render(scene, camera)
    })
  })

  function setSize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
  }

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

<h3>Camera</h3>

<div class="ml-5">
  <span>Rotation:</span>
  <span><b>X: </b>{camera?.getWorldDirection(new THREE.Vector3()).x.toFixed(3)}</span>
  <span><b>Y: </b>{camera?.getWorldDirection(new THREE.Vector3()).y.toFixed(3)}</span>
  <span><b>Z: </b>{camera?.getWorldDirection(new THREE.Vector3()).z.toFixed(3)}</span>
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

<Plane/>

<style>
  canvas {
    -webkit-tap-highlight-color: transparent;
  }
</style>
