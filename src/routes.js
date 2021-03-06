import Ebook from "./components/Ebook/Ebook.svelte";
import Store from "./views/Store.svelte";

const routes = {
  "/ebook/:filename": Ebook,

  "/store": Store,
  "/store/*": Store,
};

export default routes;
