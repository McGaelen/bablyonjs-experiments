<script>
  import {onMount} from "svelte";
  import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
  import {pointerLock} from "./lib/stores/pointerLock.store.js";
  import {userInput} from "./lib/stores/userInput.store.js"
  import * as THREE from 'three'
  import RAPIER from "@dimforge/rapier3d-compat";

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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.rotation.order = "YXZ"
    camera.position.z = 7
    camera.position.y = -5
    camera.rotation.x = -0.5
    setSize()

    let gravity = { x: 0.0, y: -9.81, z: 0.0 }
    let world = new RAPIER.World(gravity)
    const scene =  new THREE.Scene()

    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
        .setTranslation(0, -10, 0)
    world.createCollider(groundColliderDesc)
    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const planeMat = new THREE.MeshToonMaterial()
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.position.set(0, -10.0, 0)
    plane.rotation.set(3 * Math.PI / 2, 0, 0)
    plane.receiveShadow = true
    scene.add(plane)

    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.0, 1.0, 0.0)
    let rigidBody = world.createRigidBody(rigidBodyDesc)
    let colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1, 1)
    let collider = world.createCollider(colliderDesc, rigidBody)
    rigidBody.applyTorqueImpulse(new RAPIER.Vector3(
        Math.random() * 2, Math.random() * 2, Math.random() * 2), true)
    const boxGeo = new THREE.BoxGeometry(2,2,2)
    const boxMat = new THREE.MeshToonMaterial({color: 0xff0000})
    const box = new THREE.Mesh(boxGeo, boxMat)
    box.castShadow = true
    scene.add(box)




    const light = new THREE.DirectionalLight(0xffffff, 0.7)
    light.castShadow = true
    light.position.set(0, 15, -7)
    scene.add(light)

    // const loader = new GLTFLoader();
    // const data = await loader.loadAsync('/src/assets/scene.gltf', (event) => console.log(event))
    // scene.add(data.scene)



    let prevTime = 0
    renderer.setAnimationLoop((time) => {
      const delta = time - prevTime
      const dir = camera.getWorldDirection(new THREE.Vector3())

      world.timestep = delta / 1000
      world.step()


      let rotation = rigidBody.rotation()

      console.log('rigidBody rotation: ', rotation.x, rotation.y, rotation.z)

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
      if ($userInput.has('Control')) {
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

      // const translation = rigidBody.translation()
      // const boxPosition = new THREE.Vector3()
      // box.getWorldPosition(boxPosition)
      // boxPosition.set(translation.x, translation.y, translation.z)
      // box.position.copy(boxPosition)


      // console.log('box rotation: ', box.rotation)

      prevTime = time
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
  bind:this={canvas}
  on:pointermove={onpointermove}
  on:keyup={userInput.bindToKeyup}
  on:keydown={userInput.bindToKeydown}
  on:mousedown={() => canvas.requestPointerLock()}
  tabindex="1"
></canvas>

<style>
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
