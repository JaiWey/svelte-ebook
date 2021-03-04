import { get, writable } from "svelte/store";
import { getStorageBookmark, setStorageLocation } from "../utils/storage";

export const ebook = writable();
export const ebookName = writable();
export const showMenu = writable(false);
export const theme = writable();
export const fontSize = writable();
export const fontFamily = writable();
export const section = writable(0);
export const minutes = writable(0);
export const metadata = writable();
export const navigation = writable();
export const progress = writable(0);
export const pagelist = writable();
export const cover = writable();
export const isBookmark = writable(false);

export function refreshLocation() {
  const _ebook = get(ebook);
  const currentLocation = _ebook.rendition.currentLocation();
  if (currentLocation.start && currentLocation.start.index >= 0) {
    section.set(currentLocation.start.index);
    const p = _ebook.locations.percentageFromCfi(currentLocation.start.cfi);
    progress.set(Math.floor(p * 100));

    const cfistart = currentLocation.start.cfi;
    const bookmark = getStorageBookmark(get(ebookName));
    if (bookmark) {
      if (bookmark.some((item) => item.cfi === cfistart)) {
        isBookmark.set(true);
      } else {
        isBookmark.set(false);
      }
    } else {
      isBookmark.set(false);
    }

    setStorageLocation(get(ebookName), currentLocation.start.cfi);
  }
}

export function display(target, highlight = false) {
  const _ebook = get(ebook);
  if (target) {
    _ebook.rendition.display(target).then(() => {
      if (highlight) {
        if (target.startsWith("epubcfi")) {
          _ebook.getRange(target).then(() => {
            _ebook.rendition.annotations.highlight(target, {}, (e) => {});
          });
        }
      }
      refreshLocation();
    });
  } else {
    _ebook.rendition.display().then(() => {
      refreshLocation();
    });
  }
  showMenu.set(false);
}
