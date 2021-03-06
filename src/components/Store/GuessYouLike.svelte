<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  export let guessYouLike = [];

  let index = 0;
  let data = [];
  $: {
    if (guessYouLike.length > 0) {
      const length = guessYouLike.length;
      data = [
        guessYouLike[index],
        guessYouLike[(index + 1) % length],
        guessYouLike[(index + 2) % length],
      ];
    }
  }

  function change() {
    if (guessYouLike.length > 0) {
      index = (index + 3) % guessYouLike.length;
    }
  }
</script>

<div class="guess">
  <div class="guess-header">
    <div class="left">{$_("home.guessYouLike")}</div>
    <div class="right" on:click={change}>{$_("home.change")}</div>
  </div>
  <div class="guess-list">
    {#each data as guess}
      <div
        class="guess-book"
        on:click={() =>
          push(
            `/store/detail?fileName=${guess.fileName}&category=${guess.categoryText}`
          )}
      >
        <img src={guess.cover} alt={guess.title} />
        <div class="meta">
          <div class="title">
            {guess.title}
          </div>
          <div class="author">
            {guess.author}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style type="postcss">
  .guess {
    @apply px-2 my-2;
  }

  .guess-header {
    @apply flex justify-between items-center mb-2;
    & .left {
      @apply font-bold text-xl leading-5;
    }
    & .right {
      @apply font-thin text-green-600;
    }
  }

  .guess-list {
    & .guess-book {
      @apply flex m-2;
      & img {
        @apply mr-2;
        width: 4rem;
      }
      & .meta {
        @apply flex flex-col justify-between;
        & .title {
          @apply text-sm font-semibold;
        }
        & .author {
          @apply font-thin text-xs text-gray-700;
        }
      }
    }
  }
</style>
