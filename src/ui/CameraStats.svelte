<script>
  import * as THREE from 'three'
  import {currentCamera} from "../lib/graphics/currentCamera.store.js";
  import {gameClock} from "../lib/clock/gameClock.store.js";

  let position, direction
  gameClock.subscribe(() => {
    direction = $currentCamera?.getWorldDirection(new THREE.Vector3())
    position = $currentCamera?.position
  })
</script>

<h3>Camera</h3>

<div class="ml-5">
  <span>Rotation:</span>
  <span><b>X: </b>{direction?.x.toFixed(3)}</span>
  <span><b>Y: </b>{direction?.y.toFixed(3)}</span>
  <span><b>Z: </b>{direction?.z.toFixed(3)}</span>
</div>

<div class="ml-5">
  <span>Position:</span>
  <span><b>X: </b>{position?.x.toFixed(3)}</span>
  <span><b>Y: </b>{position?.y.toFixed(3)}</span>
  <span><b>Z: </b>{position?.z.toFixed(3)}</span>
</div>
