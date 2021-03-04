<script>
  import { onMount } from "svelte";

  import { _ } from "svelte-i18n";
  import { display, ebookName } from "../../stores/ebook";
  import { getStorageBookmark } from "../../utils/storage";
  import Scroll from "../common/Scroll.svelte";
  let bookmarkList = [];

  onMount(() => {
    bookmarkList = getStorageBookmark($ebookName);
  });
</script>

<div class="ebook-bookmark-content">
  <div class="bookmark-title">
    {$_("book.bookmark")} - {bookmarkList.length}
  </div>
  <Scroll top={3} bottom={4}>
    {#each bookmarkList as bookmark}
      <div class="bookmark-item" on:click={() => display(bookmark.cfi)}>
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark" />
        </div>
        <div class="bookmark-content">
          {bookmark.text}
        </div>
      </div>
    {/each}
  </Scroll>
</div>

<style type="postcss">
  .bookmark-title {
    @apply flex box-border items-center justify-center p-2;
    height: 3rem;
  }
  .bookmark-item {
    @apply flex p-2;
  }
  .slide-bookmark-item-icon {
    @apply flex items-center justify-center mr-2;
  }
  .bookmark-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
    border-bottom: 1px solid var(--color2);
  }
</style>
