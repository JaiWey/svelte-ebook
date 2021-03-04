<script>
  import { _ } from "svelte-i18n";
  import { isBookmark } from "../../stores/ebook";
  export let offsetY;
  export let threshold;
</script>

<div class="ebook-mark-wrapper">
  <div class="ebook-mark-text">
    {#if $isBookmark}
      {#if offsetY > threshold}
        {$_("book.releaseDeleteBookmark")}
      {:else}
        {$_("book.pullDeleteBookmark")}
      {/if}
    {:else if offsetY > threshold}
      {$_("book.releaseAddBookmark")}
    {:else}
      {$_("book.pullAddBookmark")}
    {/if}
    <span class="icon-down" class:flip={offsetY > threshold} />
  </div>
  <div class="ebook-mark-icon-wrapper" class:mark={$isBookmark}>
    <div class="ebook-mark-icon" class:mark={$isBookmark} />
  </div>
</div>

<style type="postcss">
  .ebook-mark-wrapper {
    @apply flex justify-center w-full;
    color: var(--background-color);
  }
  .ebook-mark-text {
    @apply fixed;
    top: 0.5rem;
    right: 3rem;
    z-index: -1;
  }
  .icon-down {
    display: inline-block;
    transition: transform 0.2s linear;
    &.flip {
      transform: rotate(180deg);
    }
  }
  .ebook-mark-icon-wrapper {
    @apply fixed;
    z-index: -1;
    top: 0;
    right: 1rem;
    &.mark {
      z-index: 1;
    }
  }
  .ebook-mark-icon {
    width: 0;
    height: 0;
    line-height: 0;
    border-width: 1.5rem 0.5rem 0.5rem 0.5rem;
    border-style: solid;
    border-color: var(--color) var(--color) transparent var(--color);

    &.mark {
      border-color: var(--color1) var(--color1) transparent var(--color1);
    }
  }
</style>
