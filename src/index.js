import './app.css'
import RAPIER from '@dimforge/rapier3d-compat'

await RAPIER.init()

const {default: App} = await import('./App.svelte')
new App({
  target: document.getElementById('app')
})
