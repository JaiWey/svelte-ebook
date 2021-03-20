<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n/dist/runtime.cjs";
  import { download } from "../api/book";
  import Scroll from "../components/common/Scroll.svelte";
  import ShelfDownloadToast from "../components/Shelf/ShelfDownloadToast.svelte";
  import ShelfFooter from "../components/Shelf/ShelfFooter.svelte";
  import ShelfList from "../components/Shelf/ShelfList.svelte";
  import ShelfSearch from "../components/Shelf/ShelfSearch.svelte";
  import ShelfTitle from "../components/Shelf/ShelfTitle.svelte";
  import { initShelfBook, shelfBook, updateShelfBook } from "../stores/shelf";

  let isEdit = false;
  let isByTime = true;
  let selectedBook = [];
  let searchText = "";
  let isDownload = false;
  let downloadTextArray = [];

  $: bookList = isByTime
    ? searchFilter($shelfBook, searchText).slice()
    : searchFilter($shelfBook, searchText)
        .slice()
        .sort((a, b) => {
          let nameA = a.type === 1 ? a.data.title : a.title;
          let nameB = b.type === 1 ? b.data.title : b.title;
          return nameA.localeCompare(nameB);
        });

  $: downloadText = downloadTextArray.join("\n");

  onMount(() => {
    initShelfBook();
  });

  function changeFilter(event) {
    isByTime = event.detail.isByTime;
  }

  function selected(event) {
    const { isSelected, title } = event.detail;
    if (isSelected) {
      selectedBook.push(title);
    } else {
      selectedBook = selectedBook.filter((b) => b === title);
    }
  }

  function search(e) {
    searchText = e.detail.searchText;
  }

  function searchFilter(bookList, searchText) {
    return !searchText || searchText.length === 0
      ? bookList
      : bookList.filter((b) =>
          b.type === 1
            ? b.data.title.toLowerCase().includes(searchText.toLowerCase())
            : b.bookList.some((b) =>
                b.data.title.toLowerCase().includes(searchText.toLowerCase())
              )
        );
  }

  function deleteBook() {
    const result = $shelfBook.filter(
      (b) => b.type !== 1 || selectedBook.indexOf(b.data.title) < 0
    );
    updateShelfBook(result);
    isEdit = false;
  }

  function createNewGroup(e) {
    const text = e.detail.text;
    if (text.length > 0) {
      const book = $shelfBook;
      const result = [
        ...book.filter(
          (b) => b.type !== 1 || selectedBook.indexOf(b.data.title) < 0
        ),
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
    const book = $shelfBook;
    const result = book
      .map((b) => {
        if (b.type === 2 && b.title === category) {
          return Object.assign(b, {
            bookList: b.bookList.concat(
              book.filter(
                (b) => b.type === 1 && selectedBook.indexOf(b.data.title) >= 0
              )
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
    const resultBook = $shelfBook.filter(
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
  <ShelfTitle {isEdit} {selectedBook} on:toggle={() => (isEdit = !isEdit)} />
  <Scroll top={2} bottom={isEdit ? 2.5 : 0}>
    <ShelfSearch {isByTime} on:filter={changeFilter} on:search={search} />
    <ShelfList {bookList} {isEdit} on:selected={selected} />
  </Scroll>
  {#if isEdit}
    <ShelfFooter
      {selectedBook}
      on:addToGroup={addToGroup}
      on:createNewGroup={createNewGroup}
      on:remove={deleteBook}
      on:download={onDownload}
    />
  {/if}
  {#if isDownload}
    <ShelfDownloadToast content={downloadText} />
  {/if}
</div>
