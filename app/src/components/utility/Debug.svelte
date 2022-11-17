<script lang="ts">
    import { debug } from "../../stores";

    export let label: string;
    export let data: any;

    let expanded = false;
</script>

{#if $debug}
    <div class="debug">
        <button
            on:click={() => (expanded = !expanded)}
            class="button is-small my-2"
        >
            Debug: {label}
        </button>
        {#if expanded}
            <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
        {/if}
    </div>
{/if}
