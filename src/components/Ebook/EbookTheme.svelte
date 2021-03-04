<script>
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";
  import { themeList } from "../../utils/constants";
  import { setStorageTheme } from "../../utils/storage";
  import { setCssThemeVar } from "../../utils/utils";
  import { ebook, theme, ebookName } from "../../stores/ebook";
  export let show;

  function setTheme(name) {
    theme.set(name);
    let _ebook = get(ebook);
    _ebook.rendition.themes.select(name);
    setStorageTheme(get(ebookName), name);
    setCssThemeVar(name);
  }
</script>

{#if show}
  <div transition:slide={{ duration: 500 }} class="ebook-theme">
    {#each themeList as theme (theme.name)}
      <div class="theme-wrapper" on:click={() => setTheme(theme.name)}>
        <div
          class="background"
          style="background-color: {theme.style.body.background}"
        />
        <div class="theme-name">
          {$_(`book.${theme.name}`)}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style type="postcss">
  .ebook-theme {
    @apply absolute z-10 right-0 left-0 w-full flex justify-around items-center;
    bottom: 3rem;
    box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .theme-wrapper {
    @apply p-2 flex-1;
  }

  .background {
    @apply h-12 border-2;
    border-color: var(--color);
  }

  .theme-name {
    @apply text-xs text-center pt-1;
  }
</style>
