<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  import { rem2px } from "../../utils/utils";
  export let featured = [];
  export let title;

  $: width = ((window.innerWidth - rem2px(1)) / 2 - rem2px(1)) * 0.5;
</script>

<div class="featured">
  <div class="featured-header">
    <div class="left">{title ? title : $_("home.featured")}</div>
  </div>
  <div class="featured-list">
    {#each featured as book, i (i)}
      <div
        class="featured-book"
        on:click={() =>
          push(
            `/store/detail?fileName=${book.fileName}&category=${book.categoryText}`
          )}
      >
        <div class="cover-wrapper">
          <img src={book.cover} alt={book.title} />
        </div>
        <div class="meta">
          <div class="title">
            {book.title}
          </div>
          <div class="author" style="width: {width}px">
            {book.author}
          </div>
          <div class="category" style="width: {width}px">
            {book.categoryText}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style type="postcss">
  .featured {
    @apply px-2 my-2;
  }

  .featured-header {
    @apply flex justify-between items-center mb-2;
    & .left {
      @apply font-bold text-xl leading-5;
    }
  }

  .featured-list {
    @apply flex flex-wrap;
    & .featured-book {
      @apply flex p-2 box-border;
      flex: 0 0 50%;
      & .cover-wrapper {
        @apply pr-1;
        flex: 0 0 30%;
      }
      & img {
        max-width: 100%;
      }
      & .meta {
        @apply flex-1 flex flex-col justify-between;
        & .title {
          @apply text-xs font-semibold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* number of lines to show */
          -webkit-box-orient: vertical;
        }
        & .author {
          @apply font-thin text-xs text-gray-700 truncate;
        }
        & .category {
          @apply font-thin text-xs text-gray-900 truncate;
        }
      }
    }
  }
</style>
