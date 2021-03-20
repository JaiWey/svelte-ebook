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

export function fontSize() {
  let fontSize = window.innerWidth / 20;
  return fontSize > 50 ? 50 : fontSize;
}
export function px2rem(px) {
  return px / fontSize();
}

export function rem2px(rem) {
  return rem * fontSize();
}
