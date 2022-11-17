<script type="ts">
    import { query } from "../stores";
</script>

<nav class="navigation">
    <div class="step step-1">
        <div class="step-header">Select your study</div>
        {#if $query.programme}
            <div class="tag is-primary is-small">{$query.programme.name}</div>
        {/if}
    </div>
    <div class="step step-2">
        <div class="step-header">Match your interests</div>
        {#if $query.categories}
            <div class="tags">
                {#each $query.categories as category}
                    <div class="tag is-primary is-small">{category.name}</div>
                {/each}
            </div>
        {/if}
    </div>
    <div class="step step-3">
        <div class="step-header">Find your match</div>
    </div>
</nav>

<style lang="less">
    .navigation {
        display: flex;
        flex-flow: row nowrap;
        gap: 1.2em;

        --colour: darken(#00d1b2, 3);
    }

    .step {
        background-color: var(--colour);
        padding: 1em 2em;
        color: white;
        position: relative;

        .step-header {
            font-size: 1.5em;
        }
    }

    .step-1 {
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
    }

    .step-1,
    .step-2,
    .step-3 {
        &::after {
            content: "";
            position: absolute;
            left: 100%;
            top: 0%;
            bottom: 0%;

            // border: 1px solid red;
            height: 100%;
            width: 1em;
            background: linear-gradient(
                    to top left,
                    white 50%,
                    transparent calc(50% + 1px)
                ),
                linear-gradient(
                    to top right,
                    var(--colour) calc(50% - 1px),
                    transparent 50%
                );
        }
    }
    .step-2,
    .step-3 {
        &::before {
            content: "";
            position: absolute;
            right: 100%;
            top: 0%;
            bottom: 0%;

            height: 100%;
            width: 1em;

            background: linear-gradient(
                    to top right,
                    transparent 50%,
                    var(--colour) calc(50% + 1px)
                ),
                linear-gradient(
                    to bottom right,
                    transparent 50%,
                    var(--colour) calc(50% + 1px)
                );
        }
    }
</style>
