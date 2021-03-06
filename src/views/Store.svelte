<script>
  import Router from "svelte-spa-router";
  import Home from "./StoreHome.svelte";
  import List from "./StoreList.svelte";
  import Detail from "./StoreDetail.svelte";
  const prefix = "/store";
  const routes = {
    "/home": Home,
    "/list": List,
    "/detail": Detail,
  };
</script>

<div class="store">
  <Router {routes} {prefix} />
</div>

<style type="postcss">
  .store {
    @apply w-full h-full relative overflow-hidden;
  }
</style>
