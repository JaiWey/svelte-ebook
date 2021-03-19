<script>
  import { pop, querystring } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import qs from "qs";
  import { list } from "../api/book";
  import Scroll from "../components/common/Scroll.svelte";
  import Featured from "../components/Store/Featured.svelte";

  let bookList = [];
  let total = {};

  $: total = bookList.reduce((acc, cur) => (acc += cur.data.length), 0);
  onMount(() => {
    list().then((res) => {
      const parsed = qs.parse($querystring);
      const data = res.data;
      const category = parsed.category;
      const keyword = parsed.keyword;
      if (category) {
        bookList = [
          {
            title: category,
            data: data.data[category],
          },
        ];
      } else if (keyword) {
        bookList = Object.keys(data.data)
          .map((category) => {
            return {
              title: category,
              data: data.data[category].filter(
                (book) =>
                  book.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
              ),
            };
          })
          .filter((category) => category.data.length > 0);
      }
    });
  });
</script>

<div class="list">
  <div class="list-header">
    <div class="icon-wrapper left" on:click={pop}>
      <span class="icon-back" />
    </div>
    <div class="header-text">
      {$_("home.books", { values: { num: total } })}
    </div>
    <div class="icon-wrapper  right">
      <span class="icon-shelf" />
    </div>
  </div>
  <Scroll top={2} bottom={0}>
    {#each bookList as category (category.title)}
      <Featured featured={category.data} title={category.title} />
    {/each}
  </Scroll>
</div>

<style type="postcss">
  .list {
  }
  .list-header {
    @apply flex items-center justify-center;
    height: 2rem;

    & .icon-wrapper {
      @apply absolute;
      top: 0.5rem;
      &.left {
        left: 0.5rem;
      }
      &.right {
        right: 0.5rem;
      }
    }
  }
</style>
