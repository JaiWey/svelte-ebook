import "./styles.svelte";
import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

import en from "../locale/en.json";
import ch from "../locale/zh.json";
import { getStorageLocale } from "./utils/storage";
import { fontSize } from "./utils/utils";

addMessages("en", en);
addMessages("zh", ch);

init({
  fallbackLocale: "zh",
  initialLocale: getStorageLocale() || getLocaleFromNavigator(),
});

document.addEventListener("DOMContentLoaded", () => {
  const size = fontSize();
  const html = document.querySelector("html");
  html.style.fontSize = size + "px";
});
