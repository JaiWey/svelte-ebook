<script>
  import { createEventDispatcher } from "svelte";
  import { _, locale } from "svelte-i18n";
  import { fade } from "svelte/transition";
  import { setStorageLocale } from "../../utils/storage";

  let isSearching;
  let searchWrapper;
  let searchText = "";
  export let isByTime;

  const dispatch = createEventDispatcher();

  function changeLocale() {
    if ($locale === "zh") {
      locale.set("en");
      setStorageLocale("en");
    } else {
      locale.set("zh");
      setStorageLocale("zh");
    }
  }

  function leaveSearching() {
    clear();
    isSearching = false;
    searchWrapper.style.position = "absolute";
    setTimeout(() => {
      searchWrapper.style.position = "";
    }, 500);
  }

  function search(e) {
    if (e.key === "Enter" && searchText.length > 0) {
      dispatch("search", {
        searchText,
      });
    }
  }

  function clear() {
    searchText = "";
    dispatch("search", {
      searchText,
    });
  }
</script>

<div class="shelf-search">
  <div
    class="search-wrapper"
    bind:this={searchWrapper}
    class:hoist={isSearching}
  >
    <div class="search-inner-wrapper">
      <span class="icon-search" />
      <input
        type="text"
        bind:value={searchText}
        on:keyup={search}
        on:click={() => (isSearching = true)}
      />
      {#if searchText.length > 0}
        <span class="icon-close-circle-fill" on:click={clear} />
      {/if}
    </div>
    <div class="lang-icon-wrapper" on:click={changeLocale}>
      {#if isSearching}
        <span class="cancel-btn" on:click={leaveSearching}
          >{$_("shelf.cancel")}</span
        >
      {:else if $locale === "zh"}
        <span class="icon-en" />
      {:else}
        <span class="icon-cn" />
      {/if}
    </div>
  </div>
  {#if isSearching}
    <div transition:fade class="search-filter">
      <div
        class="filter-title"
        class:highlight={!isByTime}
        on:click={() => dispatch("filter", { isByTime: false })}
      >
        {$_("shelf.name")}
      </div>
      <div
        class="filter-title"
        class:highlight={isByTime}
        on:click={() => dispatch("filter", { isByTime: true })}
      >
        {$_("shelf.time")}
      </div>
    </div>
  {/if}
</div>

<style type="postcss">
  .shelf-search {
    height: 2rem;
  }
  .search-wrapper {
    @apply w-full flex items-center;
    height: 2rem;
    transition: transform 0.5s linear;
    background-color: white;
    z-index: 2;

    &.hoist {
      @apply absolute;
      transform: translateY(-99%);
    }

    & .search-inner-wrapper {
      @apply flex-1 flex items-center mx-2 p-1 rounded-lg border border-solid border-gray-600;

      & input {
        @apply ml-2 outline-none border-none flex-1;
      }
    }

    & .lang-icon-wrapper {
      @apply mr-1 p-1 flex items-center justify-center;

      & .cancel-btn {
        @apply text-blue-600;
      }
    }
  }

  .search-filter {
    @apply fixed w-full flex justify-around items-center;
    top: 2rem;
    height: 2rem;
    z-index: 1;
    background: white;

    & .filter-title {
      @apply text-xs flex items-center justify-center;
      &.highlight {
        @apply text-blue-600;
      }
    }
  }
</style>
