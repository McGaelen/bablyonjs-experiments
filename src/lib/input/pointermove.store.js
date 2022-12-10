import {writable} from "svelte/store";

const {subscribe, set} = writable(new PointerEvent('pointermove'))

export const pointerMove = {
  subscribe,

  /** @param event {PointerEvent} */
  bindToPointermove(event) {
    if (!document.pointerLockElement) return
    set(event)
  },
}
