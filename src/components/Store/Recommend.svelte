<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  export let recommend = [];
</script>

<div class="recommend">
  <div class="recommend-header">
    <div class="left">{$_("home.recommend")}</div>
  </div>
  <div class="recommend-list">
    {#each recommend as book, i (i)}
      <div
        class="recommend-book"
        on:click={() =>
          push(
            `/store/detail?fileName=${book.fileName}&category=${book.categoryText}`
          )}
      >
        <img src={book.cover} alt={book.title} />
        <div class="title">
          {book.title}
        </div>
        <div class="stat">
          {$_("home.readStat", { values: { readers: book.readers } })}
        </div>
      </div>
    {/each}
  </div>
</div>

<style type="postcss">
  .recommend {
    @apply px-2 my-2;
  }

  .recommend-header {
    @apply flex justify-between items-center mb-2;
    & .left {
      @apply font-bold text-xl leading-5;
    }
  }

  .recommend-list {
    @apply flex;
    & .recommend-book {
      @apply flex-1 m-2;
      & img {
        max-width: 100%;
      }
      & .title {
        @apply text-sm font-semibold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
      & .stat {
        @apply font-thin text-xs text-gray-700;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
