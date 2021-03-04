<script>
  import { _ } from "svelte-i18n";
  import EbookBookmarkList from "./EbookBookmarkList.svelte";
  import EbookContents from "./EbookContents.svelte";
  import { showMenu } from "../../stores/ebook";
  export let show;
  let bg;
  let isShowContent = true;

  function contentTransition(node, { duration }) {
    return {
      duration,
      css: (t, u) => `
				opacity: ${t};
				transform: translateX(${-u * 100}%);
			`,
    };
  }

  function toggle() {
    setTimeout(() => {
      bg.classList.toggle("show");
    });
  }

  function showContent() {
    isShowContent = true;
  }
  function showBookmark() {
    isShowContent = false;
  }
</script>

{#if show}
  <div
    class="ebook-slide"
    transition:contentTransition={{ duration: 500 }}
    on:introstart={() => toggle()}
    on:outrostart={() => toggle()}
  >
    <div class="switch-content">
      {#if isShowContent}
        <EbookContents />
      {:else}
        <EbookBookmarkList />
      {/if}
    </div>
    <div class="switch-tab">
      <div on:click={showContent} class:active={isShowContent === true}>
        {$_("book.content")}
      </div>
      <div on:click={showBookmark} class:active={isShowContent === false}>
        {$_("book.bookmark")}
      </div>
    </div>
  </div>
  <div
    class="ebook-slide-background-blur"
    bind:this={bg}
    on:click={() => showMenu.set(false)}
  />
{/if}

<style type="postcss">
  .ebook-slide {
    @apply absolute z-20 top-0 bottom-0 flex flex-col;
    width: 80%;
    background-color: var(--background-color);
    color: var(--color);
  }

  .switch-content {
    @apply flex-1;
  }

  .switch-tab {
    @apply flex items-center;
    height: 4rem;
    & > div {
      @apply flex-1 flex items-center justify-center;
      &.active {
        color: var(--color1);
      }
    }
  }
  .ebook-slide-background-blur {
    @apply absolute inset-0;
    z-index: 15;
    background-color: transparent;
    transition: background-color 0.5s linear;
  }
  :global(.ebook-slide-background-blur.show) {
    background-color: rgba(0, 0, 0, 0.3) !important;
  }
</style>
