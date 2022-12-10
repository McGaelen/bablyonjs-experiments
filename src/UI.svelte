<script>
  import FrameTime from "./ui/FrameTime.svelte";
  import FullscreenButton from "./ui/FullscreenButton.svelte";
  import CameraStats from "./ui/CameraStats.svelte";

  /**
   * Where UI components go.
   * Everything will be constrained to the viewport width and height - any overflow will be hidden.
   * If a game component also has UI, it will be placed below everything in this file.
   */
</script>

<div class="flex justify-between">
  <FrameTime />
  <FullscreenButton />
</div>
<CameraStats />