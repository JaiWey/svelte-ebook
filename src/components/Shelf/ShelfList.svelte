<script>
  import { _ } from "svelte-i18n";
  import { flip } from "svelte/animate";
  import { push } from "svelte-spa-router";
  import ShelfListBook from "./ShelfListBook.svelte";

  export let isEdit;
  export let bookList;
</script>

<div class="book-list">
  {#each bookList as book (book.type === 1 ? book.data.title : book.title)}
    <div class="book" animate:flip={{ duration: 200 }}>
      <div class="image-wrapper">
        {#if book.type === 1}
          <ShelfListBook
            cover={book.data.cover}
            fileName={book.data.fileName}
            title={book.data.title}
            categoryText={book.data.categoryText}
            {isEdit}
            on:selected
          />
        {:else}
          <div
            class="thumbnail-image"
            on:click={() =>
              !isEdit && push(`/store/category?category=${book.title}`)}
          >
            {#each book.bookList.slice(0, 9) as book (book.data.fileName)}
              <div class="thumbnail-wrapper">
                <img src={book.data.cover} alt="cover" />
              </div>
            {/each}
          </div>
        {/if}
      </div>
      <div class="book-title">
        {book.type === 1 ? book.data.title : book.title}
      </div>
    </div>
  {/each}
  <div class="book">
    <div class="image-wrapper border">
      <div class="image-inner-wrapper">
        <span class="icon-add icon" on:click={() => push("/store/home")} />
      </div>
    </div>
  </div>
</div>

<style type="postcss">
  .book-list {
    @apply flex flex-wrap mx-2 box-border;
  }
  .book {
    @apply box-border p-2;
    width: 33%;
    flex: 0 0 33%;

    & .image-wrapper {
      @apply relative w-full;

      &.border {
        @apply border border-solid border-gray-600;
      }

      &::after {
        content: "";
        display: block;
        padding-top: 140%;
      }

      & .image-inner-wrapper {
        @apply h-full w-full flex items-center justify-center;
        position: absolute;
      }

      & .icon {
        @apply text-4xl text-gray-600;
      }
    }

    & .thumbnail-image {
      @apply absolute h-full w-full shadow-lg;
      & .thumbnail-wrapper {
        width: 33%;
        display: inline-block;
        height: 33%;
        box-sizing: border-box;
        padding: 0.1rem;

        & img {
          width: 100%;
        }
      }
    }

    & .book-title {
      @apply text-xs;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
  }
</style>
