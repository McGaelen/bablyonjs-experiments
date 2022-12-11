<script>
  import * as THREE from "three";
  import {gameClock} from "../lib/clock/gameClock.store.js";
  import {keyboard} from "../lib/input/keyboard.store.js";
  import {currentCamera} from "../lib/graphics/currentCamera.store.js";
  import {pointerMove} from "../lib/input/pointermove.store.js";
  import {onDestroy} from "svelte";

  /** @type THREE.PerspectiveCamera */
  let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.rotation.order = "YXZ"
  camera.position.z = 7
  camera.position.y = -5
  camera.rotation.x = -0.7
  camera.aspect = window.innerHeight / window.innerWidth
  camera.rotation
  currentCamera.set(camera)

  function calculateNewPosition(direction) {
    const worldAngle = Math.atan(direction.z / direction.x)
    const newX = Math.cos(worldAngle) * Math.sign(direction.x)
    const newZ = Math.sin(worldAngle) * Math.sign(direction.z) * Math.sign(worldAngle)
    return [newX, newZ]
  }

  const clock = gameClock.subscribe((delta) => {
    const dir = camera.getWorldDirection(new THREE.Vector3())

    if ($keyboard.has('w')) {
      const [x, z] = calculateNewPosition(dir.clone())
      camera.position.addScaledVector(
          new THREE.Vector3(x, 0, z), 0.005 * delta
      )
    }
    if ($keyboard.has('s')) {
      const relativeBack = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
      const [x, z] = calculateNewPosition(relativeBack)
      camera.position.addScaledVector(
          new THREE.Vector3(x, 0, z), 0.005 * delta
      )
    }
    if ($keyboard.has('a')) {
      const relativeLeft = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
      const [x, z] = calculateNewPosition(relativeLeft)
      camera.position.addScaledVector(
          new THREE.Vector3(x, 0, z), 0.005 * delta
      )
    }
    if ($keyboard.has('d')) {
      const relativeRight = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (3 * Math.PI) / 2)
      const [x, z] = calculateNewPosition(relativeRight)
      camera.position.addScaledVector(
          new THREE.Vector3(x, 0, z), 0.005 * delta
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
    const newX = camera.rotation.x - (event.movementY * 0.005)
    camera.rotation.set(
        // To stop the camera from going upside down, we have to clamp rotation around
        // the x-axis to not go passed pi/2 in either direction.
        newX >= -(Math.PI / 2) && newX <= (Math.PI / 2)
            ? newX
            : camera.rotation.x,
        camera.rotation.y - (event.movementX * 0.005),
        0
    )
  })

  onDestroy(() => {
    clock()
    pointer()
    currentCamera.set(null)
  })
</script>
