import "./styles.svelte";
import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

import en from "../locale/en.json";
import ch from "../locale/zh.json";

addMessages("en", en);
addMessages("zh", ch);

init({
  fallbackLocale: "zh",
  initialLocale: getLocaleFromNavigator(),
});

document.addEventListener("DOMContentLoaded", () => {
  let fontSize = window.innerWidth / 20;
  fontSize = fontSize > 50 ? 50 : fontSize;
  const html = document.querySelector("html");
  html.style.fontSize = fontSize + "px";
});
