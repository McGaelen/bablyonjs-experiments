import './app.css'
import App from './App.svelte'
import RAPIER from '@dimforge/rapier3d-compat'

await RAPIER.init()

const app = new App({
  target: document.getElementById('app')
})

export default app
