<script lang="ts">
    import { range } from "lodash";
    import Debug from "./Debug.svelte";

    export let page;
    export let max_page;

    $: page = Math.min(page, max_page);
    $: page = Math.max(page, 1);
</script>

<Debug label="Pagination" data={{ page, max_page }} />
<div class="paginator">
    {#each range(1, max_page + 1) as cur_page}
        <button
            class="paginator-page button is-small"
            class:is-primary={cur_page == page}
            disabled={max_page == 1}
            on:click={() => (page = cur_page)}>{cur_page}</button
        >
    {/each}
</div>

<style lang="less">
    .paginator {
        display: flex;
        flex-flow: row nowrap;

        gap: 0.2em;
    }
</style>
