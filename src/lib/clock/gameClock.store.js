import {writable} from "svelte/store";
import {physics} from "../physics/physics.js";

const {subscribe, set} = writable()

let prevTime = 0
export const gameClock = {
  subscribe,
  tick() {
    const time = Date.now()
    const delta = time - prevTime

    physics.timestep = delta / 1000 // Rapier wants timestep in seconds, so divide by 1000
    physics.step()

    set(delta) // this carries out ALL the frame-by-frame game logic.

    prevTime = time
  }
}
