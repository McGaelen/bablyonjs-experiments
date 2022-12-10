<script>
  import Camera from "./game/Camera.svelte";
  import Plane from "./game/Plane.svelte";
  import DroppedCube from "./game/DroppedCube.svelte";
  import Light from "./game/Light.svelte";

  /**
   * Manifest that contains the entire contents of the current scene and physics world.
   *
   * To handle different levels, maybe do something like this:
   * @example
   * <Camera/>
   * {#if level === 1}
   *   <Level1World />
   * {:else if level === 2}
   *   <Level2World />
   * {/if}
   */
</script>

<Camera/>
<Plane/>
<DroppedCube/>
<Light/>
