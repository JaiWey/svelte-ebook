<script>
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { derived, get } from "svelte/store";
  import {
    ebook,
    minutes,
    navigation,
    progress,
    refreshLocation,
    section,
    showMenu,
  } from "../../stores/ebook";
  export let show;

  function nextSection() {
    if ($ebook.spine.length - 1 > $section) {
      const s = $section;
      section.set(s + 1);
      displaySection(s + 1).then(() => {
        refreshLocation();
      });
    }
  }

  function previousSection() {
    const s = $section;
    if (s > 0) {
      section.set(s - 1);
      displaySection(s - 1).then(() => {
        refreshLocation();
      });
    }
  }

  function displaySection(s) {
    const _ebook = $ebook;
    const section = _ebook.section(s);
    if (section && section.href) {
      return _ebook.rendition.display(section.href);
    }
    return Promise.resolve();
  }

  function updateProgress(p) {
    const _ebook = get(ebook);
    const cfi = _ebook.locations.cfiFromPercentage(p / 100);
    _ebook.rendition.display(cfi).then(() => {
      refreshLocation();
    });
    progress.set(p);
  }

  const sectionName = derived(
    [ebook, section, navigation],
    ([$ebook, $section, $navigation]) => {
      if ($ebook) {
        const parsedSection = $ebook.section($section);
        if (
          parsedSection &&
          parsedSection.href &&
          $ebook &&
          $ebook.navigation
        ) {
          const findNav = $navigation.find(
            (n) => n.href === parsedSection.href
          );
          return (findNav && findNav.label) || "";
        }
      }
      return "";
    }
  );
</script>

{#if show}
  <div transition:slide={{ duration: 500 }} class="ebook-progress">
    <div class="text-base p-1">
      <span>{$_("book.time", { values: { minutes: $minutes } })}</span>
    </div>
    <div class="progress-wrapper">
      <div class="icon-wrapper" on:click={previousSection}>
        <span class="icon-back" />
      </div>
      <input
        type="range"
        max="100"
        min="0"
        step="1"
        value={$progress}
        on:input={(e) => updateProgress(e.target.value)}
        on:change={(e) => updateProgress(e.target.value)}
      />
      <div class="icon-wrapper" on:click={nextSection}>
        <span class="icon-forward" />
      </div>
    </div>
    <div class="section-wrapper">
      <span>
        {`${$sectionName},${$progress}%`}
      </span>
    </div>
  </div>
{/if}

<style type="postcss">
  .ebook-progress {
    @apply absolute z-10 right-0 left-0 w-full flex flex-col justify-around items-center;
    bottom: 3rem;
    box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.5);
    background-color: var(--background-color);
    color: var(--color);
  }

  .progress-wrapper {
    @apply flex w-full box-border px-3;
  }

  .icon-wrapper {
    @apply flex justify-center items-center p-1 text-xl;
  }

  input[type="range"] {
    height: 24px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    background: var(--background-color);
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000;
    background: #86a9a4;
    border-radius: 0px;
    border: 1px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: var(--background-color);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -8.5px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #86a9a4;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000;
    background: #86a9a4;
    border-radius: 0px;
    border: 1px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: var(--background-color);
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #86a9a4;
    border: 1px solid #000000;
    border-radius: 0px;
    box-shadow: 1px 1px 1px #000000;
  }
  input[type="range"]::-ms-fill-upper {
    background: #86a9a4;
    border: 1px solid #000000;
    border-radius: 0px;
    box-shadow: 1px 1px 1px #000000;
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 1px 1px 1px #000000;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background: var(--background-color);
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #86a9a4;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #86a9a4;
  }
</style>
