<script>
  import RAPIER from "@dimforge/rapier3d-compat";
  import * as THREE from "three";
  import {scene} from "../lib/graphics/scene.js";
  import {gameClock} from "../lib/clock/gameClock.store.js";
  import {physics} from "../lib/physics/physics.js";
  import {onDestroy} from "svelte";

  let rigidBody = physics.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0)
  )
  let collider = physics.createCollider(
      RAPIER.ColliderDesc.cuboid(1, 1, 1), rigidBody
  )
  rigidBody.applyTorqueImpulse(
      new RAPIER.Vector3(Math.random() * -3, Math.random() * -3, Math.random() * -3),
      true
  )

  const box = new THREE.Mesh(
      new THREE.BoxGeometry(2,2,2),
      new THREE.MeshToonMaterial({color: 0xff0000})
  )
  box.castShadow = true
  scene.add(box)

  const clock = gameClock.subscribe((delta) => {
    let rotation = rigidBody.rotation()
    box.rotation.setFromQuaternion(
        new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    )

    let position = rigidBody.translation()
    box.position.x = position.x
    box.position.y = position.y
    box.position.z = position.z
  })

  onDestroy(() => {
    clock()
    physics.removeCollider(collider)
    physics.removeRigidBody(rigidBody)
    scene.remove(box)
  })
</script>
