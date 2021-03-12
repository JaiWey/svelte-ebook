<script>
  import { slide, fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import ShelfCategoryDialog from "./ShelfCategoryDialog.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let selectedBook;
  export let isCategory = false;
  export let categoryTitle = "";

  let showRemove = false;
  let showMove = false;
  let showDownload = false;

  function cancel() {
    showRemove = showDownload = false;
  }

  function confirm() {
    if (showRemove) {
      dispatch("remove");
    } else {
    }
  }

  function createNewGroup(e) {
    showMove = false;
    dispatch("createNewGroup", e.detail);
  }

  function addToGroup(e) {
    showMove = false;
    dispatch("addToGroup", e.detail);
  }
</script>

<div class="shelf-footer" class:active={selectedBook.length > 0}>
  <div
    class="tab-wrapper"
    class:active={(selectedBook.length = 1)}
    on:click={() => (showDownload = true)}
  >
    <span class="icon icon-download" />
    <span class="tab-title">{$_("shelf.download")}</span>
  </div>
  <div class="tab-wrapper" on:click={() => (showMove = true)}>
    <span class="icon icon-move" />
    <span class="tab-title">{$_("shelf.move")}</span>
  </div>
  <div class="tab-wrapper" on:click={() => (showRemove = true)}>
    <span class="icon icon-shelf" />
    <span class="tab-title">{$_("shelf.remove")}</span>
  </div>
</div>
{#if showRemove || showDownload}
  <div transition:slide class="bottom-popup">
    <div class="popup-title">
      {$_(`shelf.${showRemove ? "removeBookTitle" : "setDownloadTitle"}`)}
    </div>
    <div class="btn" on:click={confirm}>
      {$_(`shelf.${showRemove ? "delete" : "open"}`)}
    </div>
    <div class="btn" on:click={cancel}>{$_("shelf.cancel")}</div>
  </div>
{/if}
{#if showMove}
  <div transition:fade class="center-dialog">
    <ShelfCategoryDialog
      {isCategory}
      {categoryTitle}
      on:close={() => (showMove = false)}
      on:addToGroup={addToGroup}
      on:createNewGroup={createNewGroup}
    />
  </div>
{/if}

<style type="postcss">
  .shelf-footer {
    @apply fixed bottom-0 w-full flex justify-around items-center;
    height: 2.5rem;
    background-color: white;
    box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);

    &.active {
      & .tab-wrapper {
        @apply text-gray-900;
      }
    }
    & .tab-wrapper {
      @apply flex flex-col items-center text-gray-500;

      & .icon {
        @apply text-xl;
      }
      & .tab-title {
        @apply text-xs;
      }
    }
  }

  .bottom-popup {
    @apply fixed bottom-0 w-full flex flex-col items-center;
    background-color: white;

    & .popup-title {
      @apply text-xs text-gray-600 py-2;
    }

    & .btn {
      @apply font-bold py-1;
    }
  }

  .center-dialog {
    @apply fixed inset-0 flex items-center justify-center;
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
