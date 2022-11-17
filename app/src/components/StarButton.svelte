<script lang="ts">
    export let active: boolean = false;
    export let label: string;
</script>

<button
    on:click
    class="button is-small"
    class:is-primary={active}
    class:is-active={active}
>
    <iconify-icon
        icon={active ? "ph:star-fill" : "ph:star-light"}
        class="mr-1"
    />
    {label}
</button>

<style lang="less">
    button {
        &:not(.is-active):hover {
            iconify-icon {
                color: rgb(231, 210, 22);
                transform: scale(1.4, 1.4);

                transition: transform 200ms ease-in-out;
            }
        }

        &.is-active {
            iconify-icon {
                color: rgb(231, 210, 22);
            }
        }
    }
</style>
