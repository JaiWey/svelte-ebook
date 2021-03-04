import { themeList } from "./constants";

export function setCssThemeVar(name) {
  const style = themeList.find((t) => t.name === name).style;
  document.documentElement.style.setProperty("--color", style.body.color);
  document.documentElement.style.setProperty(
    "--background-color",
    style.body.background
  );
  document.documentElement.style.setProperty("--color1", style.color1);
  document.documentElement.style.setProperty("--color2", style.color2);
}

export function px2rem(px) {
  const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return px / size;
}

export function rem2px(rem) {
  const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * size;
}
