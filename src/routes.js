import Ebook from "./components/Ebook/Ebook.svelte";

const routes = {
  // Exact path
  //'/': Home,

  // Using named parameters, with last being optional
  //'/author/:first/:last?': Author,

  // Wildcard parameter
  "/ebook/:filename": Ebook,

  // Catch-all
  // This is optional, but if present it must be the last
  //'*': NotFound,
};

export default routes;
