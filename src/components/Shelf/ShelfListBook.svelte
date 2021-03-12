<script>
  import { createEventDispatcher } from "svelte";
  import { push } from "svelte-spa-router";

  export let isEdit;
  export let cover;
  export let fileName;
  export let title;
  export let categoryText;
  let isSelected;

  const dispatch = createEventDispatcher();

  function click() {
    if (isEdit) {
      isSelected = !isSelected;
      dispatch("selected", {
        title,
        isSelected,
      });
    } else {
      push(`/store/detail?fileName=${fileName}&category=${categoryText}`);
    }
  }
</script>

<div class="shelf-list-book" on:click={click}>
  <img src={cover} alt={cover} />
  {#if isEdit}
    <span class="icon icon-selected" class:active={isSelected} />
  {/if}
</div>

<style type="postcss">
  .shelf-list-book {
    @apply absolute w-full;
    & img {
      @apply w-full;
    }
    & .icon {
      @apply absolute text-gray-600;
      bottom: 0.5rem;
      right: 0.25rem;

      &.active {
        @apply text-blue-700;
      }
    }
  }
</style>
