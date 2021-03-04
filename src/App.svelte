<script>
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<div class="root">
  <Router {routes} />
</div>

<style type="postcss">
  .root {
    @apply fixed inset-0;
  }
</style>
