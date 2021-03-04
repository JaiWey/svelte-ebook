<script>
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import {
    metadata,
    cover,
    minutes,
    progress,
    navigation,
    ebook,
    display,
  } from "../../stores/ebook";
  import Scroll from "../common/Scroll.svelte";

  let searchText = "";
  let isSearching = false;
  let searchRes = [];

  function showSearch() {
    isSearching = true;
  }

  function hideSearch() {
    isSearching = false;
  }

  function search(e) {
    if (e.key === "Enter" && searchText.length > 0) {
      const _ebook = get(ebook);
      Promise.all(
        _ebook.spine.spineItems.map((item) =>
          item
            .load(_ebook.load.bind(_ebook))
            .then(item.find.bind(item, searchText))
            .finally(item.unload.bind(item))
        )
      )
        .then((results) => Promise.resolve([].concat.apply([], results)))
        .then((result) => {
          searchRes = result.map((item, i) => {
            const reg = new RegExp(searchText, "i");
            item.excerpt = item.excerpt.replace(
              reg,
              `<span class="content-search-text">${searchText}</span>`
            );
            item.index = i;
            return item;
          });
        });
    }
  }
</script>

<div class="ebook-content">
  <div class="ebook-search-wrapper">
    <div class="search-input-wrapper">
      <div class="search-icon-wrapper">
        <span class="icon-search" />
      </div>
      <input
        type="text"
        placeholder={$_("book.searchHint")}
        on:keyup={search}
        on:click={showSearch}
        bind:value={searchText}
      />
    </div>
    {#if isSearching}
      <span class="cancel-wrapper" on:click={hideSearch}>
        {$_("book.cancelSearch")}
      </span>
    {/if}
  </div>
  {#if isSearching}
    <Scroll top={3} bottom={4}>
      {#each searchRes as item (item.index)}
        <div class="search-item" on:click={() => display(item.cfi, true)}>
          {@html item.excerpt}
        </div>
      {/each}
    </Scroll>
  {:else}
    <div class="book-info">
      <div class="meta-data">
        <img src={$cover} alt="cover" />
        <div class="info-wrapper">
          <div class="creator">{$metadata.creator}</div>
          <div class="title">{$metadata.title}</div>
        </div>
      </div>
      <div class="progress-data">
        <div class="progress-info">
          {$_("book.haveRead", { values: { percentage: $progress } })}
        </div>
        <div class="time-info">
          {$_("book.haveReadTime", { values: { minutes: $minutes } })}
        </div>
      </div>
    </div>
    <Scroll top={8} bottom={4}>
      {#each $navigation as navItem (navItem.id)}
        <div class="content-item" on:click={() => display(navItem.href)}>
          <div class="content-label">{navItem.label}</div>
          {#if navItem.page}
            <div class="content-page">{navItem.page}</div>
          {/if}
        </div>
      {/each}
    </Scroll>
  {/if}
</div>

<style type="postcss">
  .ebook-content {
    @apply w-full;
    background-color: var(--background-color);
    color: var(--color);
  }

  .ebook-search-wrapper {
    @apply flex items-center box-border h-12 p-2;

    & .search-input-wrapper {
      @apply flex-1 flex;
      border: 1px solid var(--color);
      border-radius: 3px;

      & .search-icon-wrapper {
        @apply p-1;
      }
    }

    & .cancel-wrapper {
      @apply mx-1 font-bold;
    }

    & input {
      background: transparent;
      border: none;
      outline: none;
    }
  }

  .book-info {
    @apply flex justify-between items-center text-xs box-border h-20 px-2;
    & > .meta-data {
      @apply flex;
      & > img {
        height: 3rem;
        margin-right: 1rem;
      }
      & > .info-wrapper {
        @apply flex flex-col justify-center;
        & .creator {
          @apply font-thin truncate;
          max-width: 6rem;
        }
        & .title {
          @apply mt-1 font-semibold truncate;
          max-width: 6rem;
        }
      }
    }
    & > .progress-data {
      @apply flex flex-col justify-center;
    }
  }
  .content-item {
    @apply flex p-2 mx-2;
    & .content-label {
      @apply flex-1 truncate;
    }
    & .content-page {
      flex: 0 0 1rem;
    }
  }

  .search-item {
    @apply px-2 py-4 mx-2;
  }
  :global(.content-search-text) {
    color: var(--color1) !important;
  }
</style>
