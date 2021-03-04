<script>
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { fontSizeList } from "../../utils/constants";
  import { setStorageFontSize } from "../../utils/storage";
  import { ebook, fontFamily, fontSize, ebookName } from "../../stores/ebook";
  import EbookFontFaimly from "./EbookFontFaimly.svelte";
  export let show;

  let isShowFontPopup = false;

  $: if (!show) {
    isShowFontPopup = false;
  }

  function showPopUp() {
    isShowFontPopup = true;
  }

  function closePopUp() {
    isShowFontPopup = false;
  }

  function setFontSize(size) {
    const _ebook = get(ebook);
    _ebook.rendition.themes.fontSize(size);
    setStorageFontSize(get(ebookName), size);
    fontSize.set(size);
  }
</script>

{#if show}
  <div transition:slide={{ duration: 500 }} class="ebook-font">
    <div class="font-size">
      <span class="text-xl">A</span>
      <div class="font-size-list">
        {#each fontSizeList as font}
          <div class="line-wrapper" on:click={() => setFontSize(font.fontSize)}>
            <div class="left" />
            <div class="ball" class:visible={font.fontSize === $fontSize} />
            <div class="vertical" />
            <div class="right" />
          </div>
        {/each}
      </div>
      <span class="big">A</span>
    </div>
    <div class="font-family">
      <div class="current-font-family" on:click={showPopUp}>{$fontFamily}</div>
      <div><span class="icon-forward" /></div>
    </div>
  </div>
{/if}
<EbookFontFaimly on:close={closePopUp} show={isShowFontPopup} />

<style type="postcss">
  .ebook-font {
    @apply absolute z-10 right-0 left-0 w-full flex flex-col;
    bottom: 3rem;
    box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .font-size {
    @apply flex justify-around items-center  pt-2;
  }
  .font-size-list {
    @apply flex;
  }
  .big {
    font-size: 2rem;
  }
  .line-wrapper {
    @apply relative;
    @apply flex;
    & > .vertical {
      position: relative;
      top: 0.225rem;
      border-left: 0.1rem solid var(--color);
      height: 0.5rem;
    }
    & > .left,
    & > .right {
      position: relative;
      width: 1rem;
      border-bottom: 0.1rem solid var(--color);
    }
    & > .ball {
      @apply absolute;
      visibility: hidden;
      background-color: var(--color);
      z-index: 1;
      left: 0.5rem;
      height: 0.25rem;
      width: 0.25rem;
      border: 0.4rem solid var(--background-color);
      border-radius: 50%;
      box-shadow: 0 0 0 0.02rem var(--color);
      &.visible {
        visibility: visible;
      }
    }
    &:first-child {
      & > .left {
        visibility: hidden;
      }
    }
    &:last-child {
      & > .right {
        visibility: hidden;
      }
    }
  }

  .font-family {
    @apply p-2 flex justify-center items-center text-xs;
  }
</style>
