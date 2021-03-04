<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { fontFamilyList } from "../../utils/constants";
  import { setStorageFontFamily } from "../../utils/storage";
  import { ebook, fontFamily, ebookName } from "../../stores/ebook";

  export let show;

  const dispatch = createEventDispatcher();

  function setFontFamily(font) {
    const _ebook = get(ebook);
    if (font === "Default") {
      _ebook.rendition.themes.font("Times New Roman");
    } else {
      _ebook.rendition.themes.font(font);
    }
    setStorageFontFamily(get(ebookName), font);
    fontFamily.set(font);
  }
</script>

{#if show}
  <div transition:slide={{ duration: 700 }} class="ebook-font-family">
    <div class="title-header">
      <div class="icon-wrapper" on:click={() => dispatch("close")}>
        <span class="icon-down2" />
      </div>
      <div class="title">{$_("book.chooseFont")}</div>
    </div>
    <div class="font-family-list">
      {#each fontFamilyList as font}
        <div class="font-family" on:click={() => setFontFamily(font.font)}>
          <span class="font-name">{font.font}</span>
          <div class="icon-wrapper">
            <span
              class="icon-check"
              class:visible={font.font === $fontFamily}
            />
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style type="postcss">
  .ebook-font-family {
    @apply absolute bottom-0 z-20 right-0 left-0 w-full flex flex-col;
    box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .title-header {
    @apply relative h-12 flex items-center justify-center;
    & > .icon-wrapper {
      @apply absolute;
      top: 1rem;
      left: 1rem;
    }
  }

  .font-family {
    @apply p-3 flex justify-between items-center;
  }

  .icon-check {
    visibility: hidden;
    &.visible {
      visibility: visible;
    }
  }
</style>
