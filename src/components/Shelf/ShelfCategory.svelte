<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { slide, fade } from "svelte/transition";
  import qs from "qs";
  import { pop, querystring } from "svelte-spa-router";
  import {
    initShelfBook,
    shelfBook,
    updateShelfBook,
  } from "../../stores/shelf";
  import ShelfTitle from "./ShelfTitle.svelte";
  import Scroll from "../common/Scroll.svelte";
  import ShelfList from "./ShelfList.svelte";
  import ShelfFooter from "./ShelfFooter.svelte";
  import ShelfDownloadToast from "./ShelfDownloadToast.svelte";
  import { download } from "../../api/book";

  let isEdit = false;
  let selectedBook = [];
  let isEditGroup = false;
  let isModifyName = false;
  let category;
  let bookList;
  let isDownload = false;
  let downloadTextArray = [];

  $: {
    let result = $shelfBook.find((b) => b.type === 2 && b.title === category);
    if (result) {
      bookList = result.bookList;
    } else {
      bookList = [];
    }
  }
  $: downloadText = downloadTextArray.join("\n");

  onMount(() => {
    initShelfBook();
    const parsed = qs.parse($querystring);
    category = parsed.category;
  });

  function selected(event) {
    const { isSelected, title } = event.detail;
    if (isSelected) {
      selectedBook.push(title);
    } else {
      selectedBook = selectedBook.filter((b) => b === title);
    }
  }

  function deleteGroup() {
    const book = $shelfBook;
    const result = [
      ...book.filter((b) => b.type !== 2 || b.title !== category),
      ...book.find((b) => b.type === 2 && b.title === category).bookList,
    ];
    updateShelfBook(result);
    pop();
  }

  function removeBook() {
    const book = $shelfBook;
    const result = [
      ...book.map((b) => {
        if (b.type !== 2 || b.title !== category) {
          return b;
        } else {
          return Object.assign({}, b, {
            bookList: b.bookList.filter(
              (b) => selectedBook.indexOf(b.data.title) < 0
            ),
          });
        }
      }),
      ...book
        .find((b) => b.type === 2 && b.title === category)
        .bookList.filter((b) => selectedBook.indexOf(b.data.title) >= 0),
    ];
    updateShelfBook(result);
    isEdit = false;
  }

  function createNewGroup(e) {
    const text = e.detail.text;
    const sourceCategory = e.detail.sourceCategory;
    if (text.length > 0) {
      const book = $shelfBook;
      const result = [
        ...book.map((b) => {
          if (b.type === 2 || b.title === sourceCategory) {
            return Object.assign(b, {
              bookList: b.bookList.filter(
                (b) => b.type !== 1 || selectedBook.indexOf(b.data.title) < 0
              ),
            });
          } else {
            return b;
          }
        }),
        {
          type: 2,
          title: text,
          bookList: book.filter(
            (b) => b.type === 1 && selectedBook.indexOf(b.data.title) >= 0
          ),
        },
      ];
      updateShelfBook(result);
      selectedBook = [];
      isEdit = false;
    }
  }

  function addToGroup(e) {
    const category = e.detail.category;
    const sourceCategory = e.detail.sourceCategory;
    const book = $shelfBook;
    const result = book
      .map((b) => {
        if (b.type === 2 && b.title === category) {
          return Object.assign({}, b, {
            bookList: b.bookList.concat(
              book
                .find((b) => b.type === 2 && b.title === sourceCategory)
                .bookList.filter(
                  (b) => b.type === 1 && selectedBook.indexOf(b.data.title) >= 0
                )
            ),
          });
        } else if (b.type === 2 && b.title === sourceCategory) {
          return Object.assign({}, b, {
            bookList: b.bookList.filter(
              (b) => b.type !== 1 || selectedBook.indexOf(b.data.title) < 0
            ),
          });
        } else {
          return b;
        }
      })
      .filter((b) => b.type !== 1 || selectedBook.indexOf(b.data.title) < 0);
    updateShelfBook(result);
    selectedBook = [];
    isEdit = false;
  }

  function onDownload() {
    isDownload = true;
    const resultBook = $shelfBook
      .find((b) => b.type === 2 && b.title === category)
      .bookList.filter(
        (b) => b.type === 1 && selectedBook.indexOf(b.data.title) >= 0
      );
    for (let i = 0; i < resultBook.length; i++) {
      const book = resultBook[i];
      download(
        book,
        (book) => {
          console.log("[" + book.data.fileName + "]下载成功...");
          downloadTextArray[i] = ` ${book.data.fileName} ` + "download Finish";
          if (
            downloadTextArray.filter((t) => !t.endsWith("download Finish"))
              .length === 0
          ) {
            isDownload = false;
            isEdit = false;
            downloadTextArray = [];
          }
        },
        (e) => {
          isDownload = false;
          isEdit = false;
          downloadTextArray = [];
          console.log(e);
        },
        (e) => {
          isDownload = false;
          isEdit = false;
          downloadTextArray = [];
          console.log(e);
        },
        (progressEvent) => {
          const progress =
            Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
          console.log(progress);
          downloadTextArray[
            i
          ] = `Downloading ${book.data.fileName} ${progress}`;
        }
      );
    }
  }
</script>

<div>
  <ShelfTitle
    {isEdit}
    {selectedBook}
    isCategory={true}
    on:toggle={() => {
      isEdit = !isEdit;
      isEditGroup = false;
    }}
    on:editGroup={() => (isEditGroup = true)}
  />
  <Scroll top={2} bottom={isEdit ? 2.5 : 0}>
    <ShelfList {bookList} {isEdit} on:selected={selected} />
  </Scroll>
  {#if isEdit}
    <ShelfFooter
      {selectedBook}
      isCategory={true}
      categoryTitle={category}
      on:remove={removeBook}
      on:addToGroup={addToGroup}
      on:createNewGroup={createNewGroup}
      on:download={onDownload}
    />
  {/if}
  {#if isEditGroup}
    <div transition:slide class="edit-popup">
      <div class="tab" on:click={deleteGroup}>{$_("shelf.deleteGroup")}</div>
      <div class="tab" on:click={() => (isEditGroup = false)}>
        {$_("shelf.cancel")}
      </div>
    </div>
  {/if}
  {#if isModifyName}
    <div transition:fade class="center-dialog" />
  {/if}
  {#if isDownload}
    <ShelfDownloadToast content={downloadText} />
  {/if}
</div>

<style type="postcss">
  .edit-popup {
    @apply fixed w-full bottom-0 flex flex-col items-center bg-white;
    border-top: 1px solid #eee;

    & .tab {
      @apply font-black p-2;
    }
  }

  .center-dialog {
    @apply fixed inset-0 flex items-center justify-center;
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
