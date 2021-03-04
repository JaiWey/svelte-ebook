<script>
  import { slide } from "svelte/transition";
  import { showMenu } from "../../stores/ebook";
</script>

{#if $showMenu}
  <div transition:slide={{ duration: 500 }} class="ebook-header">
    <div class="left">
      <div class="icon-wrapper">
        <span class="icon-back" />
      </div>
    </div>

    <div class="right">
      <div class="icon-wrapper">
        <span class="icon-shelf" />
      </div>
      <div class="icon-wrapper">
        <span class="icon-cart" />
      </div>
      <div class="icon-wrapper">
        <span class="icon-more" />
      </div>
    </div>
  </div>
{/if}

<style type="postcss">
  .ebook-header {
    @apply absolute z-10 top-0 right-0 left-0 w-full flex justify-between py-1;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .icon-wrapper {
    @apply flex justify-center items-center p-1 text-xl;
  }

  .right {
    @apply flex;
  }
</style>
