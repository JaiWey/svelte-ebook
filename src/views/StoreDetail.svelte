<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import qs from "qs";
  import { _ } from "svelte-i18n";
  import Epub from "epubjs";
  import { pop, push, querystring } from "svelte-spa-router";
  import Scroll from "../components/common/Scroll.svelte";
  import { detail } from "../api/book";
  import {
    addShelfBook,
    initShelfBook,
    removeShelfBook,
    shelfBook,
  } from "../stores/shelf";

  let opf;
  let fileName;
  let book;
  let rendition;
  let categoryText;
  let cover;
  let metadata;
  let navigation;
  let description;

  $: flatNavigation =
    navigation && navigation.length > 0 ? flat(navigation.toc) : [];

  $: lang = metadata ? metadata.language : "-";
  $: isbn = metadata ? metadata.identifier : "-";
  $: publisher = metadata ? metadata.publisher : "-";
  $: title = metadata ? metadata.title : "";
  $: author = metadata ? metadata.creator : "";
  $: isInShelf = $shelfBook
    .map((b) => (b.type === 1 ? b.data : b.bookList.map((b) => b.data)))
    .flat()
    .some((b) => b.fileName === fileName);

  onMount(() => {
    initShelfBook();
    const parsed = qs.parse($querystring);

    fileName = parsed.fileName;
    categoryText = parsed.category;
    if (fileName) {
      detail({
        fileName: fileName,
      }).then((response) => {
        if (
          response.status === 200 &&
          response.data.error_code === 0 &&
          response.data.data
        ) {
          const data = response.data.data;
          const bookItem = data;
          cover = bookItem.cover;
          let rootFile = data.rootFile;
          if (rootFile.startsWith("/")) {
            rootFile = rootFile.substring(1, rootFile.length);
          }
          const url = "APP_EPUB_OPF_URL";
          opf = `${url}/${fileName}/${rootFile}`;
          parseBook(opf);
        } else {
        }
      });
    }
  });

  function parseBook(blob) {
    book = new Epub(blob);
    book.loaded.metadata.then((meta) => {
      metadata = meta;
    });
    book.loaded.navigation.then((nav) => {
      navigation = nav;
      // if (navigation.toc && navigation.toc.length > 1) {
      //   display(navigation.toc[1].href)
      //     .then(section => {
      //       // if (this.$refs.scroll) {
      //       //   this.$refs.scroll.refresh()
      //       // }
      //       // this.displayed = true
      //       const reg = new RegExp('<.+?>', 'g')
      //       const text = section.output.replace(reg, '').replace(/\s\s/g, '')
      //       description = text
      //     })
      // }
    });
  }

  function display(location) {
    if (false) {
      if (!rendition) {
        rendition = book.renderTo("preview", {
          width: window.innerWidth > 640 ? 640 : window.innerWidth,
          height: window.innerHeight,
          method: "default",
        });
      }
      if (!location) {
        return rendition.display();
      } else {
        return rendition.display(location);
      }
    }
  }

  function flat(nav, deep = 1) {
    const arr = [];
    nav.forEach((item) => {
      item.deep = deep;
      arr.push(item);
      if (item.subitems && item.subitems.length > 0) {
        arr.push(...flat(item.subitems, deep + 1));
      }
    });
    return arr;
  }
</script>

<div transition:fade>
  <div class="header-wrapper">
    <div class="icon-wrapper left">
      <span class="icon-back" on:click={pop} />
    </div>
    <div class="icon-wrapper right">
      <span class="icon-shelf" on:click={() => push("/store/shelf")} />
    </div>
  </div>
  <Scroll top={2} bottom={3}>
    <div class="book-summary">
      <div class="cover-wrapper">
        <img src={cover} alt="cover" />
      </div>
      <div class="book-detail">
        <div class="book-title">
          {title}
        </div>
        <div class="book-author">
          {author}
        </div>
        <div class="book-description">
          {description ? description : ""}
        </div>
      </div>
    </div>
    <div class="book-meta-wrapper">
      <div class="book-meta-title">{$_("detail.copyright")}</div>
      <div class="book-meta-list-wrapper">
        <div class="book-meta-row">
          <div class="book-meta-label">{$_("detail.publisher")}</div>
          <div class="book-meta-text">{publisher}</div>
        </div>
        <div class="book-meta-row">
          <div class="book-meta-label">{$_("detail.category")}</div>
          <div class="book-meta-text">{categoryText}</div>
        </div>
        <div class="book-meta-row">
          <div class="book-meta-label">{$_("detail.lang")}</div>
          <div class="book-meta-text">{lang}</div>
        </div>
        <div class="book-meta-row">
          <div class="book-meta-label">{$_("detail.ISBN")}</div>
          <div class="book-meta-text">{isbn}</div>
        </div>
      </div>
    </div>
    <div class="book-content-wrapper">
      <div class="book-content-title">{$_("detail.navigation")}</div>
      <div class="book-content-list-wrapper">
        <div class="book-content-item-wrapper">
          {#each flatNavigation as nav}
            <div class="book-content-item">
              {#if nav.label}
                <div
                  class="book-content-navigation-text"
                  style="margin-left:{(nav.deep - 1) * 0.3}rem;"
                >
                  {nav.label}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </Scroll>
  <div class="bottom-wrapper">
    <div class="bottom-btn" on:click={push(`/ebook/${fileName}?opf=${opf}`)}>
      {$_("detail.read")}
    </div>
    {#if isInShelf}
      <div class="bottom-btn" on:click={() => removeShelfBook(title)}>
        {$_("detail.isAddedToShelf")}
      </div>
    {:else}
      <div
        class="bottom-btn"
        on:click={() =>
          addShelfBook({
            cover,
            title,
            opf,
            fileName,
            categoryText,
          })}
      >
        {$_("detail.addOrRemoveShelf")}
      </div>
    {/if}
  </div>
</div>

<style type="postcss">
  .header-wrapper {
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

  .book-summary {
    @apply flex;
    & .cover-wrapper {
      @apply px-2;
      display: 0 0 30%;
      width: 30%;
      & img {
        width: 100%;
      }
    }
    & .book-detail {
      @apply px-2 flex-1 flex flex-col justify-center;
      & .book-title {
        @apply font-bold text-2xl;
      }
      & .book-author {
        @apply text-sm;
      }
      & .book-description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
    }
  }

  .book-meta-wrapper {
    @apply mt-4 px-2;
    & .book-meta-title {
      @apply font-bold text-2xl my-4;
    }
    & .book-meta-row {
      @apply flex text-sm my-1;
      & .book-meta-label {
        @apply text-right pr-2;
        flex: 1;
      }
      & .book-meta-text {
        flex: 4;
      }
    }
  }

  .book-content-wrapper {
    @apply mt-4 px-2;
    & .book-content-title {
      @apply font-bold text-2xl;
    }

    & .book-content-item {
      @apply py-3;
      border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    }
  }
  .bottom-wrapper {
    @apply flex;
    height: 3rem;
    & .bottom-btn {
      @apply font-bold flex-1 flex items-center justify-center;
    }
  }
</style>
