<script lang="ts">
    import { Link } from "svelte-navigator";
    export let items: { label: string; path: string }[] = [];
</script>

<div class="breadcrumbs">
    {#each items as item, index}
        {#if index > 0}
            <span class="divider" />
        {/if}
        <Link to={item.path} class="tag">{item.label}</Link>
    {/each}
</div>

<style lang="less">
    .breadcrumbs {
        display: flex;
        flex-flow: row nowrap;
        gap: 0.2em;
    }
    .divider {
        width: 0.6em;
        height: 0.6em;
        // border-right: 1px dashed grey;
        // border-top: 1px dashed grey;
        border-right: 1px solid #666;
        border-top: 1px solid #666;
        margin: auto 0;
        transform: scale(0.7, 1) rotate(45deg);
    }
</style>
