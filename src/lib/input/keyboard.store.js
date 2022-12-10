import {writable} from "svelte/store";

/** @type Set<string> */
const pressedKeys = new Set()
const {subscribe, update} = writable(pressedKeys)

export const keyboard = {
  subscribe,

  /** @param event {KeyboardEvent} */
  bindToKeyup(event) {
    update(val => {
      val.delete(event.key)
      return val
    })
  },

  /** @param event {KeyboardEvent} */
  bindToKeydown(event) {
    if (event.repeat) return
    update(val => {
      val.add(event.key)
      return val
    })
  }
}
