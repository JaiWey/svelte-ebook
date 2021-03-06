<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  import { categoryText, getCategoryName } from "../../utils/constants";
  export let categoryList;
</script>

<div class="category-list">
  {#each categoryList as category (category.category)}
    <div class="category">
      <div class="category-header">
        <div class="category-text">{$_(categoryText(category.category))}</div>
        <div
          class="category-see-all"
          on:click={() =>
            push(`/store/list?category=${getCategoryName(category.category)}`)}
        >
          {$_("home.seeAll")}
        </div>
      </div>
      <div class="book-list">
        {#each category.list as book (book.id)}
          <div
            class="book"
            on:click={() =>
              push(
                `/store/detail?fileName=${book.fileName}&category=${book.categoryText}`
              )}
          >
            <div class="book-cover">
              <img src={book.cover} alt="bookcover" />
            </div>
            <div class="book-title">
              {book.title}
            </div>
            <div class="book-author">
              {book.author}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style type="postcss">
  .category-list {
    @apply my-2;
  }
  .category {
    @apply my-2;
  }
  .category-header {
    @apply px-1 flex justify-between;

    & .category-text {
    }
  }

  .book-list {
    @apply flex;

    & .book {
      @apply px-1 box-border;
      flex: 0 0 25%;
      width: 25%;
      & .book-cover {
        @apply flex items-center justify-center;
      }

      & img {
        @apply w-full;
      }
      & .book-title {
        @apply text-xs font-semibold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
      }

      & .book-author {
        @apply text-xs text-gray-700;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
