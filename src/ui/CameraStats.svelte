<script>
  // import * as THREE from 'three'
  // import {currentCamera} from "../lib/graphics/currentCamera.store.js";
  // import {gameClock} from "../lib/clock/gameClock.store.js";
  //
  // let position, direction
  // gameClock.subscribe(() => {
  //   direction = $currentCamera?.getWorldDirection(new THREE.Vector3())
  //   position = $currentCamera?.position
  // })

  import {getContext} from "svelte";

  let game = getContext('game')
  $: x = game.camera?.getDirection().x.toFixed(3)
  $: y = game.camera?.getDirection().y.toFixed(3)
  $: z = game.camera?.getDirection().z.toFixed(3)
</script>

<!--<h3>Camera</h3>-->

<div class="ml-5">
  <span>Rotation:</span>
  <span><b>X: </b>{x}</span>
  <span><b>Y: </b>{y}</span>
  <span><b>Z: </b>{z}</span>
</div>

<!--<div class="ml-5">-->
<!--  <span>Position:</span>-->
<!--  <span><b>X: </b>{position?.x.toFixed(3)}</span>-->
<!--  <span><b>Y: </b>{position?.y.toFixed(3)}</span>-->
<!--  <span><b>Z: </b>{position?.z.toFixed(3)}</span>-->
<!--</div>-->
