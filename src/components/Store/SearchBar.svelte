<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import {
    getStorageSearchHistory,
    setStorageSearchHistory,
  } from "../../utils/storage";
  export let isCompress;
  let isSearching = false;

  let searchWrapper;
  let searchInput;
  let searchHistory;

  $: compress = isCompress || isSearching;

  onMount(() => {
    searchHistory = getStorageSearchHistory();
  });

  function back() {
    if (isSearching) {
      isSearching = false;
    } else {
      push("/store/shelf");
    }
  }

  function enterSearch(e) {
    if (e.key === "Enter" && searchInput.length > 0) {
      search(searchInput);
    }
  }

  function search(s) {
    if (searchHistory) {
      const result = searchHistory
        .filter((h) => h !== s)
        .concat(s)
        .reverse()
        .slice(0, 10);
      setStorageSearchHistory(result);
    }
    push("/store/list?keyword=" + s);
  }

  function deleteHistory() {
    if (searchHistory) {
      const result = searchHistory.filter((h) => h !== s);
      setStorageSearchHistory(result);
    }
  }
</script>

<div class="search-bar" class:compress>
  <div class="header-wrapper">
    <div class="icon-wrapper left">
      <span class="icon-back" on:click={back} />
    </div>
    <div class="header-title">
      {$_("home.title")}
    </div>
    <div class="icon-wrapper right">
      <span class="icon-shake" />
    </div>
  </div>
  <div class="search-wrapper" bind:this={searchWrapper} class:compress>
    <div class="inner">
      <div class="search-icon-wrapper">
        <span class="icon-search" />
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          bind:value={searchInput}
          on:click={() => (isSearching = true)}
          on:keyup={enterSearch}
        />
      </div>
    </div>
  </div>
  {#if isSearching}
    <div transition:fade class="search-content">
      {#if searchHistory}
        {#if searchHistory.length > 0}
          <div class="search-title">{$_("home.searchHistory")}</div>
          {#each searchHistory as history}
            <div class="history-item-wrapper">
              <div class="history" on:click={() => search(history)}>
                {history}
              </div>
              <div on:click={() => deleteHistory(history)}>✖</div>
            </div>
          {/each}
        {:else}
          <div class="search-title">{$_("home.noHistory")}</div>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style type="postcss">
  .search-bar {
    @apply relative;
    transition: height 0.5s linear;
    height: 4rem;
    &.compress {
      height: 2rem;
      & .header-title {
        opacity: 0;
      }
      & .icon-wrapper.right {
        opacity: 0;
      }
    }
  }
  .header-wrapper {
    @apply flex justify-center items-center;
    height: 2rem;
  }

  .header-title {
    transition: opacity 0.5s linear;
  }

  .icon-wrapper {
    @apply absolute;
    top: 0.5rem;
    &.left {
      left: 0.5rem;
    }
    &.right {
      display: none;
      right: 0.5rem;
      transition: opacity 0.5s linear;
    }
  }
  .search-wrapper {
    @apply box-border px-2 py-1;
    left: 0;
    right: 0;
    position: absolute;
    top: 2rem;
    height: 2rem;
    transition: top 0.5s linear, left 0.5s linear;

    & .inner {
      @apply flex items-center bg-gray-300;

      height: 1.5rem;
      border-radius: 2rem;
    }

    & .search-icon-wrapper {
      @apply mx-2;
    }
    & .input-wrapper {
      flex: 1;
    }
    &.compress {
      top: 0;
      left: 1.5rem;
    }
  }

  .search-content {
    @apply fixed w-full;
    top: 2rem;
    bottom: 0;
    background: white;

    & .search-title {
      margin: 12px 18px;
    }

    & .history-item-wrapper {
      @apply flex items-center justify-center mx-4;
      border-bottom: 1px solid rgba(20, 20, 20, 0.3);
      & > .history {
        @apply truncate text-xl;
        width: 85%;
      }
    }
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.7rem;
  }
</style>
