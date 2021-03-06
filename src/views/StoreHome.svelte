<script>
  import { onMount } from "svelte";
  import { home } from "../api/book";
  import Category from "../components/Store/Category.svelte";
  import CategoryBook from "../components/Store/CategoryBook.svelte";
  import Feature from "../components/Store/Featured.svelte";
  import GuessYouLike from "../components/Store/GuessYouLike.svelte";
  import Recommend from "../components/Store/Recommend.svelte";
  import SearchBar from "../components/Store/SearchBar.svelte";
  import { rem2px } from "../utils/utils";

  let content;
  let isCompress = false;

  let banner;
  let guessYouLike = [];
  let recommend = [];
  let featured = [];
  let categoryList = [];
  let categories = [];
  let randomList = [];

  onMount(() => {
    home().then((res) => {
      if ((res.status = 200)) {
        const data = res.data;
        banner = data.banner;
        guessYouLike = data.guessYouLike;
        recommend = data.recommend;
        featured = data.featured;
        categoryList = data.categoryList;
        categories = data.categories;
        randomList = data.random;
      }
    });
    content.style.height = window.innerHeight - rem2px(2) + "px";
    content.addEventListener("scroll", (e) => {
      if (e.target.scrollTop > 0) {
        isCompress = true;
      } else {
        isCompress = false;
      }
    });
  });
</script>

<div class="store-home">
  <SearchBar {isCompress} />
  <div class="content" bind:this={content}>
    <div class="banner">
      {#if banner}
        <img src={banner} alt="banner" />
      {/if}
    </div>
    <GuessYouLike {guessYouLike} />
    <Recommend {recommend} />
    <Feature {featured} />
    <CategoryBook {categoryList} />
    <Category {categories} />
  </div>
</div>

<style type="postcss">
  .store-home {
  }
  .banner {
    @apply p-2;
    & img {
      @apply w-full;
    }
  }
  .content {
    @apply overflow-x-hidden overflow-x-scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
