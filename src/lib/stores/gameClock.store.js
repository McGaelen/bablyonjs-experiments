import {readable} from "svelte/store";
import * as THREE from 'three'

// const FRAME_DURATION = 0.033333333 // 30fps.
const FRAME_DURATION = 0.016666666 // 60fps.

const clock = new THREE.Clock(false)

export const gameClock = readable(0,  (set) => {
  function tick(num) {
    requestAnimationFrame(tick)
    set(num)

    clock.start()
    while (clock.getElapsedTime() < FRAME_DURATION) { }
    clock.stop()
  }

  tick()
})
