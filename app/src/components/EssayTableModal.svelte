<script lang="ts">
    import type { QueryData } from "@steers/common";
    import EssayTable from "./EssayTable.svelte";
    import Modal from "./utility/Modal.svelte";

    export let focus: QueryData["required"];

    let showModal = false;
</script>

<button
    class="button is-small is-info is-inverted"
    title="Essays - see list of essays this recommendation is based on"
    on:click={() => (showModal = true)}
>
    <div class="icon">
        <iconify-icon icon="ph:files" />
    </div>
</button>

<Modal bind:showModal>
    {#if showModal}
        <EssayTable {focus} />
    {/if}
</Modal>
