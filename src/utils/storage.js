import { themeList } from "./constants";

export function getStorage(key, defaultValue = {}) {
  const v = localStorage.getItem(key);
  let result;
  if (v) {
    try {
      result = JSON.parse(v);
    } catch (e) {
      return {};
    }
  } else {
    result = defaultValue;
    localStorage.setItem(key, result);
  }
  return result;
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getStorageValue(key, valueKey, defaultValue) {
  const v = localStorage.getItem(key);
  let result;
  if (v) {
    try {
      result = JSON.parse(v);
    } catch (e) {
      return undefined;
    }
  } else {
    result = {};
  }
  if (!result[valueKey]) {
    if (defaultValue !== undefined) {
      result[valueKey] = defaultValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result[valueKey];
    } else {
      return undefined;
    }
  }
  return result[valueKey];
}

export function setStorageValue(key, valueKey, value) {
  const v = localStorage.getItem(key);
  let result;
  if (v) {
    try {
      result = JSON.parse(v);
    } catch (e) {
      return "";
    }
  } else {
    result = {};
  }

  result[valueKey] = value;
  localStorage.setItem(key, JSON.stringify(result));
  return result[valueKey];
}

export function getStorageTheme(bookName) {
  return getStorageValue(bookName, "theme", themeList[0].name);
}

export function setStorageTheme(bookName, themeName) {
  return setStorageValue(bookName, "theme", themeName);
}

export function getStorageFontSize(bookName) {
  return getStorageValue(bookName, "fontSize", 16);
}

export function setStorageFontSize(bookName, fontSize) {
  return setStorageValue(bookName, "fontSize", fontSize);
}

export function getStorageFontFamily(bookName) {
  return getStorageValue(bookName, "fontFamily", "Default");
}

export function setStorageFontFamily(bookName, fontFamily) {
  return setStorageValue(bookName, "fontFamily", fontFamily);
}

export function getStorageMinutes(bookName) {
  return getStorageValue(bookName, "minutes", 0);
}

export function setStorageMinutes(bookName, minutes) {
  return setStorageValue(bookName, "minutes", minutes);
}

export function getStorageLocation(bookName) {
  return getStorageValue(bookName, "location");
}

export function setStorageLocation(bookName, location) {
  return setStorageValue(bookName, "location", location);
}

export function getStorageBookmark(bookName) {
  return getStorageValue(bookName, "bookmark", []);
}

export function setStorageBookmark(bookName, bookmark) {
  return setStorageValue(bookName, "bookmark", bookmark);
}

export function getStorageSearchHistory() {
  return getStorage("searchHistory", []);
}

export function setStorageSearchHistory(history) {
  return setStorage("searchHistory", history);
}

export function getStorageShelf() {
  return getStorage("shelf", []);
}

export function setStorageShelf(shelf) {
  return setStorage("shelf", shelf);
}
export function getStorageLocale() {
  return localStorage.getItem("ebookLocale");
}

export function setStorageLocale(locale) {
  return localStorage.getItem("ebookLocale", locale);
}
