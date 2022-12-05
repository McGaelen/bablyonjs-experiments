import {readable} from "svelte/store";

/** @type import('svelte/store').Readable<boolean> */
export const pointerLock = readable(false, (set) =>
  document.addEventListener('pointerlockchange',
      () => set(!!document.pointerLockElement)
  )
)
