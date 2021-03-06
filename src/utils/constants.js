import { _ } from "svelte-i18n";
import { get } from "svelte/store";

//const i = t => get(_(t))

export const themeList = [
  {
    name: "Default",
    style: {
      body: {
        color: "#4c5059",
        background: "#cecece",
      },
      color1: "#346cb9",
      color2: "#b8b9bb",
    },
  },
  {
    name: "Gold",
    style: {
      body: {
        color: "#5c5b56",
        background: "#c6c2b6",
      },
      color1: "#84602c",
      color2: "#b4b0a4",
    },
  },
  {
    name: "Eye",
    style: {
      body: {
        color: "#404c42",
        background: "#a9c1a9",
      },
      color1: "#407724",
      color2: "#9bae98",
    },
  },
  {
    name: "Night",
    style: {
      body: {
        color: "#cecece",
        background: "#000000",
      },
      color1: "#3b587a",
      color2: "#1f2022",
    },
  },
];

export const fontSizeList = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 },
];

export const fontFamilyList = [
  { font: "Default" },
  { font: "Cabin" },
  { font: "Days One" },
  { font: "Montserrat" },
  { font: "Tangerine" },
];

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return "ComputerScience";
    case 2:
      return "SocialSciences";
    case 3:
      return "Economics";
    case 4:
      return "Education";
    case 5:
      return "Engineering";
    case 6:
      return "Environment";
    case 7:
      return "Geography";
    case 8:
      return "History";
    case 9:
      return "Laws";
    case 10:
      return "LifeSciences";
    case 11:
      return "Literature";
    case 12:
      return "Biomedicine";
    case 13:
      return "BusinessandManagement";
    case 14:
      return "EarthSciences";
    case 15:
      return "MaterialsScience";
    case 16:
      return "Mathematics";
    case 17:
      return "MedicineAndPublicHealth";
    case 18:
      return "Philosophy";
    case 19:
      return "Physics";
    case 20:
      return "PoliticalScienceAndInternationalRelations";
    case 21:
      return "Psychology";
    case 22:
      return "Statistics";
  }
}

export function categoryText(category) {
  const name = getCategoryName(category);
  return "category." + name[0].toLowerCase() + name.slice(1);
}
