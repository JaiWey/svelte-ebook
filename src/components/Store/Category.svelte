<script>
  import { _ } from "svelte-i18n";
  import { categoryText } from "../../utils/constants";
  export let categories;
</script>

<div class="category-list">
  {#each categories as category (category.category)}
    <div class="category">
      <div class="inner-wrapper">
        <div class="left">
          <div class="category-title">
            {$_(categoryText(category.category))}
          </div>
          <div class="book-stat">
            {$_("home.books", { values: { num: category.num } })}
          </div>
        </div>
        <div class="right">
          <img class="img1" src={category.img1} alt="img1" />
          <img class="img2" src={category.img2} alt="img2" />
        </div>
      </div>
    </div>
  {/each}
</div>

<style type="postcss">
  .category-list {
    @apply my-2 flex flex-wrap;
  }
  .category {
    @apply p-2 box-border;
    flex: 0 0 50%;
    width: 50%;
  }
  .inner-wrapper {
    @apply flex bg-gray-200;
  }

  .left {
    @apply flex flex-col items-center justify-center;
    flex: 0 0 50%;
    & .category-title {
      @apply text-xs font-semibold text-center;
    }
    & .book-stat {
      @apply text-xs text-gray-700;
    }
  }

  .right {
    @apply relative;
    flex: 0 0 40%;
    height: 5rem;

    & img {
      @apply absolute;
    }
    & .img1 {
      width: 2rem;
      top: 1rem;
      left: 0.5rem;
      z-index: 2;
    }
    & .img2 {
      width: 1.5rem;
      top: 1.5rem;
      left: 1.5rem;
      z-index: 1;
    }
  }
</style>
