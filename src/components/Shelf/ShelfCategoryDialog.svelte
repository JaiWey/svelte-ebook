<script>
  import { createEventDispatcher } from "svelte";

  import { _ } from "svelte-i18n";
  import { shelfBook } from "../../stores/shelf";

  export let isCategory = false;
  export let categoryTitle = "";
  let isCreating = false;
  let text = "";
  $: categories = $shelfBook.filter((c) => c.type === 2);

  const dispatch = createEventDispatcher();
</script>

<div class="move-content">
  <div class="move-title">
    {$_(`shelf.${isCreating ? "newGroup" : "moveBook"}`)}
  </div>
  {#if isCreating}
    <div class="new-category">{$_("shelf.groupName")}</div>
    <input type="text" bind:value={text} />
    <div class="btn-group">
      <span on:click={() => dispatch("close")}>{$_("shelf.cancel")}</span>
      <span
        class="confirm"
        class:active={text.length > 0}
        on:click={() =>
          text.length > 0 &&
          dispatch("createNewGroup", {
            text,
            sourceCategory: isCategory ? categoryTitle : "",
          })}>{$_("shelf.confirm")}</span
      >
    </div>
  {:else}
    <div class="new-category" on:click={() => (isCreating = true)}>
      {$_("shelf.newGroup")}
    </div>
    {#each categories as category}
      <div
        class="category-title"
        class:active={isCategory && category.title === categoryTitle}
        on:click={() =>
          dispatch("addToGroup", {
            category: category.title,
            sourceCategory: isCategory ? categoryTitle : "",
          })}
      >
        {category.title}
      </div>
    {/each}
    <div class="btn-group" on:click={() => dispatch("close")}>
      <span>{$_("shelf.cancel")}</span>
    </div>
  {/if}
</div>

<style type="postcss">
  .move-content {
    @apply bg-white rounded-lg flex flex-col items-stretch;
    width: 50%;
  }
  .move-title {
    @apply font-black p-4 text-center;
  }

  .new-category {
    @apply text-blue-700 p-2 text-xs;
  }
  .category-title {
    @apply p-2 text-xs;
    &.active {
      @apply text-blue-500;
    }
  }

  .btn-group {
    @apply bg-blue-700 text-white p-2 text-sm flex;
    & span {
      @apply text-center flex-1;
      &.confirm {
        @apply text-gray-500;
        &.active {
          @apply text-white;
        }
      }
    }
  }

  input {
    @apply outline-none border-none m-1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.7);
  }
</style>
