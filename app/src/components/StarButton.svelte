<script lang="ts">
    export let active: boolean = false;
    export let label: string;
</script>

<button
    on:click
    class="button is-small is-outlined"
    class:is-primary={!active}
    class:is-danger={active}
    class:is-active={active}
>
    <iconify-icon icon={active ? "ph:x" : "ph:plus"} class="mr-1" />
    {label}
</button>
