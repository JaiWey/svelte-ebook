<script>
  import { slide } from "svelte/transition";
  import { showMenu } from "../../stores/ebook";
  import EbookFont from "./EbookFont.svelte";
  import EbookProgress from "./EbookProgress.svelte";
  import EbookSlide from "./EbookSlide.svelte";
  import EbookTheme from "./EbookTheme.svelte";

  let menu = 0;

  $: if (!$showMenu) {
    menu = 0;
  }
</script>

{#if $showMenu}
  <div transition:slide={{ duration: 500 }} class="ebook-menu">
    <div class="icon-wrapper">
      <span
        class="icon-menu"
        on:click={() => {
          menu = 1;
        }}
      />
    </div>
    <div class="icon-wrapper">
      <span
        class="icon-progress"
        on:click={() => {
          menu = 2;
        }}
      />
    </div>
    <div class="icon-wrapper">
      <span
        class="icon-bright"
        on:click={() => {
          menu = 3;
        }}
      />
    </div>
    <div class="icon-wrapper">
      <span
        class="icon-A"
        on:click={() => {
          menu = 4;
        }}
      />
    </div>
  </div>
{/if}
<EbookSlide show={menu === 1} />
<EbookProgress show={menu === 2} />
<EbookTheme show={menu === 3} />
<EbookFont show={menu === 4} />

<style type="postcss">
  .ebook-menu {
    @apply absolute z-10 bottom-0 right-0 left-0 w-full flex justify-around items-center h-12;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .icon-wrapper {
    @apply flex justify-center items-center p-1 text-xl;
  }
</style>
