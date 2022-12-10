import {writable} from "svelte/store";

const {subscribe, set} = writable(null)

export const currentCamera = {
  subscribe,
  set
}
