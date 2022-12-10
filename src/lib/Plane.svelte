<script>
  import {getContext, onMount} from "svelte";
  import {userInput} from "./stores/userInput.store.js";
  import RAPIER from "@dimforge/rapier3d-compat";
  import * as THREE from "three";

  const game = getContext('game')

  userInput.subscribe((keys) => {
    if (keys.has('w')) {
      console.log(game.physics)
    }
  })

  onMount(() => {
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0, 10.0)
        .setTranslation(0, -10, 0)
    game.physics.createCollider(groundColliderDesc)
    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const planeMat = new THREE.MeshToonMaterial()
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.position.set(0, -10.0, 0)
    plane.rotation.set(3 * Math.PI / 2, 0, 0)
    plane.receiveShadow = true
    plane.castShadow = true
    game.scene.add(plane)
  })
</script>
