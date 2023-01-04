<script>
  import {gameClock} from "../lib/clock/gameClock.store.js";
  import {keyboard} from "../lib/input/keyboard.store.js";
  import {pointerMove} from "../lib/input/pointermove.store.js";
  import {getContext, onDestroy, onMount} from "svelte";
  import {Axis, Quaternion, Vector3 as BVector3} from "@babylonjs/core";

  /** @type GameContext */
  const game = getContext('game')

  /** @param direction {BVector3}*/
  function calculateNewPosition(direction) {
    const worldAngle = Math.atan(direction.z / direction.x)
    const newX = Math.cos(worldAngle) * Math.sign(direction.x)
    const newZ = Math.sin(worldAngle) * Math.sign(direction.z) * Math.sign(worldAngle)
    return [newX, newZ]
  }

  const clock = gameClock.subscribe((delta) => {
    if (!game.camera) return
    const dir = game.camera.getDirection(Axis.Z)


    if ($keyboard.has('w')) {
      const [x, z] = calculateNewPosition(dir.clone())
      game.camera.position = game.camera.position.add(
          new BVector3(x, 0, z).scale(0.005 * delta)
      )
    }
    if ($keyboard.has('s')) {
      const relativeBack = dir.clone().applyRotationQuaternion(Quaternion.FromEulerAngles(0, Math.PI, 0))
      const [x, z] = calculateNewPosition(relativeBack)
      game.camera.position = game.camera.position.add(
          new BVector3(x, 0, z).scale(0.005 * delta)
      )
    }
    if ($keyboard.has('a')) {
      const relativeLeft = dir.clone().applyRotationQuaternion(Quaternion.FromEulerAngles(0, (3 * Math.PI / 2), 0))
      const [x, z] = calculateNewPosition(relativeLeft)
      game.camera.position = game.camera.position.add(
          new BVector3(x, 0, z).scale(0.005 * delta)
      )
    }
    if ($keyboard.has('d')) {
      const relativeRight = dir.clone().applyRotationQuaternion(Quaternion.FromEulerAngles(0, Math.PI / 2, 0))
      const [x, z] = calculateNewPosition(relativeRight)
      game.camera.position = game.camera.position.add(
          new BVector3(x, 0, z).scale(0.005 * delta)
      )
    }
    if ($keyboard.has(' ')) {
      game.camera.position.y += 0.005 * delta
    }
    if ($keyboard.has('q')) {
      game.camera.position.y -= 0.005 * delta
    }
  })

  const pointer = pointerMove.subscribe((event) => {
    if (!game.camera) return
    const newX = game.camera.rotation.x - (event.movementY * -0.003)
    game.camera.rotation.set(
        // To stop the game.camera from going upside down, we have to clamp rotation around
        // the x-axis to not go passed pi/2 in either direction.
        newX >= -(Math.PI / 2) && newX <= (Math.PI / 2)
            ? newX
            : game.camera.rotation.x,
        game.camera.rotation.y - (event.movementX * -0.003),
        0
    )
  })

  onDestroy(() => {
    clock()
    pointer()
  })
</script>
