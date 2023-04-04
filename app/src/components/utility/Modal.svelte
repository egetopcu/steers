<script>
    export let showModal; // boolean

    let dialog; // HTMLDialogElement

    $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self={() => dialog.close()}
>
    <div class="content" on:click|stopPropagation>
        <slot />
        <button
            class="button is-danger is-rounded"
            autofocus
            on:click={() => dialog.close()}
        >
            <div class="icon">
                <iconify-icon icon="ph:x-circle" />
            </div>
        </button>
    </div>
</dialog>

<style>
    dialog {
        max-width: calc(min(90vw, 820px));
        border-radius: 0.2em;
        border: none;
        padding: 0;
        z-index: 2;
        max-height: 90vh;
        overflow: visible;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
        position: absolute;
        z-index: 3;

        top: -0.5rem;
        left: -0.5rem;
    }
    .content {
        max-height: 90vh;
        height: min-content;
        overflow-y: auto;
    }
</style>
