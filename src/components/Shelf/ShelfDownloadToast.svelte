<script>
  export let content;
</script>

<div class="mask">
  <div class="content">{content}</div>
</div>

<style type="postcss">
  .mask {
    @apply fixed inset-0 flex justify-center items-center;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .content {
    @apply p-2 rounded-lg;
    max-width: 70%;
    background-color: white;
  }
</style>
