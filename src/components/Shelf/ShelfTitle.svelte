<script>
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { pop } from "svelte-spa-router";
  import { updateShelfBook } from "../../stores/shelf";

  export let isEdit;
  export let selectedBook;
  export let shelfTitle;
  export let isCategory = false;

  const dispatch = createEventDispatcher();
</script>

<div class="shelf-title">
  <div class="shelf-title-btn-wrapper">
    {#if isCategory}
      {#if isEdit}
        <span on:click={() => dispatch("editGroup")}
          >{$_("shelf.editGroup")}</span
        >
      {:else}
        <span class="icon-back" on:click={pop} />
      {/if}
    {:else}
      <span on:click={() => updateShelfBook([])}>{$_("shelf.clearCache")}</span>
    {/if}
  </div>
  <div class="shelf-title-text-wrapper">
    <span class="shelf-title-text"
      >{shelfTitle ? shelfTitle : $_("shelf.title")}</span
    >
    {#if isEdit}
      <span class="shelf-title-sub-text">
        {#if selectedBook.length > 0}
          {$_("shelf.haveSelectedBook", {
            values: { length: selectedBook.length },
          })}
        {:else}
          {$_("shelf.selectBook")}
        {/if}
      </span>
    {/if}
  </div>
  <div class="shelf-title-btn-wrapper" on:click={() => dispatch("toggle")}>
    <span>
      {#if isEdit}
        {$_("shelf.cancel")}
      {:else}
        {$_("shelf.edit")}
      {/if}
    </span>
  </div>
</div>

<style type="postcss">
  .shelf-title {
    @apply w-full relative flex justify-between items-center text-sm;
    height: 2rem;
  }
  .shelf-title-text-wrapper {
    @apply absolute w-full flex flex-col items-center;
    z-index: -1;
    & .shelf-title-text {
      @apply font-bold;
    }
    & .shelf-title-sub-text {
      @apply text-xs text-gray-600;
    }
  }

  .shelf-title-btn-wrapper {
    @apply mx-2;
  }
</style>
