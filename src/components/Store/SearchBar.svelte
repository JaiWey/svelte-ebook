<script>
  import { _ } from "svelte-i18n";
  import { pop, push } from "svelte-spa-router";
  export let isCompress;
  export let isSearching = false;

  let searchWrapper;
  let searchInput;

  $: compress = isCompress || isSearching;

  function enterSearch(e) {
    if (e.key === "Enter" && searchInput.length > 0) {
      push("/store/list?search=" + searchInput);
    }
  }
</script>

<div class="search-bar" class:compress={isCompress}>
  <div class="header-wrapper">
    <div class="icon-wrapper left">
      <span class="icon-back" on:click={pop} />
    </div>
    <div class="header-title">
      {$_("home.title")}
    </div>
    <div class="icon-wrapper right">
      <span class="icon-shake" />
    </div>
  </div>
  <div
    class="search-wrapper"
    bind:this={searchWrapper}
    class:compress={isCompress}
  >
    <div class="inner">
      <div class="search-icon-wrapper">
        <span class="icon-search" />
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          bind:value={searchInput}
          on:click={() => (isSearching = true)}
          on:keyup={enterSearch}
        />
      </div>
    </div>
  </div>
</div>

<style type="postcss">
  .search-bar {
    @apply relative;
    transition: height 0.5s linear;
    height: 4rem;
    &.compress {
      height: 2rem;
      & .header-title {
        opacity: 0;
      }
      & .icon-wrapper.right {
        opacity: 0;
      }
    }
  }
  .header-wrapper {
    @apply flex justify-center items-center;
    height: 2rem;
  }

  .header-title {
    transition: opacity 0.5s linear;
  }

  .icon-wrapper {
    @apply absolute;
    top: 0.5rem;
    &.left {
      left: 0.5rem;
    }
    &.right {
      right: 0.5rem;
      transition: opacity 0.5s linear;
    }
  }
  .search-wrapper {
    @apply box-border px-2 py-1;
    left: 0;
    right: 0;
    position: absolute;
    top: 2rem;
    height: 2rem;
    transition: top 0.5s linear, left 0.5s linear;

    & .inner {
      @apply flex items-center bg-gray-300;

      height: 1.5rem;
      border-radius: 2rem;
    }

    & .search-icon-wrapper {
      @apply mx-2;
    }
    & .input-wrapper {
      flex: 1;
    }
    &.compress {
      top: 0;
      left: 1.5rem;
    }
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
  }
</style>
