import { get, writable } from "svelte/store";
import { getStorageShelf, setStorageShelf } from "../utils/storage";

// type 1: Book,
// type 2: Category,
// type 3: Add Icon
export const shelfBook = writable([]);

export function initShelfBook() {
  shelfBook.set(getStorageShelf());
}

export function addShelfBook(book) {
  const shelfBookList = get(shelfBook);
  const result = shelfBookList.concat({
    type: 1,
    data: book,
  });
  setStorageShelf(result);
  shelfBook.set(result);
}

export function removeShelfBook(title) {
  const shelfBookList = get(shelfBook);
  const result = shelfBookList.filter(
    (b) => b.type === 1 && b.data.title === title
  );
  setStorageShelf(result);
  shelfBook.set(result);
}

export function updateShelfBook(bookList) {
  setStorageShelf(bookList);
  shelfBook.set(bookList);
}
