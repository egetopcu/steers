<script lang="ts">
  import { Link } from "svelte-navigator";
  export let items: { label: string; path: string }[] = [];
</script>

<div class="breadcrumbs">
  {#each items as item}
    <Link to={item.path}>{item.label}</Link>
  {/each}
</div>
