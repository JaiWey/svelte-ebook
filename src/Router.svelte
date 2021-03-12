<script>
  import Router, { replace } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import Ebook from "./components/Ebook/Ebook.svelte";
  import Store from "./views/Store.svelte";

  const routes = {
    "/": wrap({
      // The Svelte component used by the route
      component: Store,

      // Custom data: any JavaScript object
      // This is optional and can be omitted
      // It can be useful to understand the component who caused the pre-condition failure
      // userData: {
      //     defaultPage: true,
      // },

      // List of route pre-conditions
      conditions: [
        (detail) => {
          replace("/store/shelf");
          return false;
        },
      ],
    }),
    "/ebook/:filename": Ebook,

    "/store": Store,
    "/store/*": Store,
  };

  function conditionsFailed(e) {}
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} />
