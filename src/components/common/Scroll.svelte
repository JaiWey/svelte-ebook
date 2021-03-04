<script>
  import { rem2px } from "../../utils/utils";

  export let top = 0;
  export let bottom = 0;

  $: height = window.innerHeight - rem2px(top + bottom);
</script>

<div class="wrapper" style="height: {height}px">
  <slot />
</div>

<style type="postcss">
  .wrapper {
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
