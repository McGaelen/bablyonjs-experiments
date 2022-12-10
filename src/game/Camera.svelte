<script>
  import * as THREE from "three";
  import {gameClock} from "../lib/clock/gameClock.store.js";
  import {keyboard} from "../lib/input/keyboard.store.js";
  import {currentCamera} from "../lib/graphics/currentCamera.store.js";
  import {pointerMove} from "../lib/input/pointermove.store.js";
  import {onDestroy} from "svelte";
  import {scene} from "../lib/graphics/scene.js";

  /** @type THREE.PerspectiveCamera */
  let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.rotation.order = "YXZ"
  camera.position.z = 7
  camera.position.y = -5
  camera.rotation.x = -0.7
  camera.aspect = window.innerHeight / window.innerWidth
  currentCamera.set(camera)

  const clock = gameClock.subscribe((delta) => {
    const dir = camera.getWorldDirection(new THREE.Vector3())
    if ($keyboard.has('w')) {
      const relativeForward = dir.clone()
      camera.position.addScaledVector(
          new THREE.Vector3(relativeForward.x, 0, relativeForward.z), 0.005 * delta
      )
    }
    if ($keyboard.has('s')) {
      const relativeBack = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
      camera.position.addScaledVector(
          new THREE.Vector3(relativeBack.x, 0, relativeBack.z), 0.005 * delta
      )
    }
    if ($keyboard.has('a')) {
      const relativeLeft = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
      camera.position.addScaledVector(
          new THREE.Vector3(relativeLeft.x, 0, relativeLeft.z), 0.005 * delta
      )
    }
    if ($keyboard.has('d')) {
      const relativeRight = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (3 * Math.PI) / 2)
      camera.position.addScaledVector(
          new THREE.Vector3(relativeRight.x, 0, relativeRight.z), 0.005 * delta
      )
    }
    if ($keyboard.has(' ')) {
      camera.position.y += 0.005 * delta
    }
    if ($keyboard.has('q')) {
      camera.position.y -= 0.005 * delta
    }
  })

  const pointer = pointerMove.subscribe((event) => {
    camera.rotation.set(
        camera.rotation.x -= (event.movementY * 0.005),
        camera.rotation.y -= (event.movementX * 0.005),
        0
    )
  })

  onDestroy(() => {
    clock()
    pointer()
    currentCamera.set(null)
  })
</script>
