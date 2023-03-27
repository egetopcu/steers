<script type="ts">
    import { query } from "../stores";
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();
</script>

<nav class="navigation">
    <div
        class="step step-1"
        on:click={() => navigate("/")}
        on:keydown={() => navigate("/")}
    >
        <div class="step-header">Select your study</div>
        {#if $query.programme}
            <div class="tag is-primary is-small">{$query.programme.name}</div>
        {/if}
    </div>
    <div
        class="step step-2"
        class:disabled={!$query.programme}
        on:click={$query.programme ? () => navigate("/interests") : null}
        on:keydown={$query.programme ? () => navigate("/interests") : null}
    >
        <div class="step-header">Choose your interests</div>
        {#if $query.categories}
            <div class="tags">
                {#each $query.categories as category}
                    <div class="tag is-primary is-small">{category.name}</div>
                {/each}
            </div>
        {/if}
    </div>
    <!-- <div class="step step-3" class:disabled={!$query.categories?.length}>
        <div class="step-header">Find your match</div>
    </div> -->
    <div class="step-4-container">
        <div
            class="substep step-4-tutors"
            class:disabled={!$query.categories?.length}
            on:click={!!$query.categories?.length
                ? () => navigate("/supervisor")
                : null}
            on:keydown={!!$query.categories?.length
                ? () => navigate("/supervisor")
                : null}
        >
            <div class="step-header">Supervisors</div>
        </div>
        <div
            class="substep step-4-topics"
            class:disabled={!$query.categories?.length}
            on:click={!!$query.categories?.length
                ? () => navigate("/topic")
                : null}
            on:keydown={!!$query.categories?.length
                ? () => navigate("/topic")
                : null}
        >
            <div class="step-header">Topics</div>
        </div>
        <div
            class="substep step-4-hosts"
            class:disabled={!$query.categories?.length}
            on:click={!!$query.categories?.length
                ? () => navigate("/host")
                : null}
            on:keydown={!!$query.categories?.length
                ? () => navigate("/host")
                : null}
        >
            <div class="step-header">Host organizations</div>
        </div>
    </div>
</nav>

<style lang="less">
    .navigation {
        display: flex;
        flex-flow: row nowrap;
        gap: 1.2em;

        --colour: darken(#00d1b2, 3);
        width: 100%;
    }

    .step,
    .step-4-container {
        flex: 1;
    }

    .substep {
        background-color: var(--colour);
        padding: 0.5em 2em 0.5em 1em;
        color: white;
        position: relative;
        font-size: 80%;

        flex: 1 1 1fr;

        .step-header {
            font-size: 1.2em !important;
        }

        &.disabled {
            filter: saturate(0);
        }

        & + .substep {
            margin-top: 0.33em;
        }
    }

    .step,
    .substep {
        background-color: var(--colour);
        padding: 1em 2em;
        color: white;
        position: relative;

        .step-header {
            font-size: 1.5em;
        }

        &.disabled {
            filter: saturate(0);
            cursor: not-allowed;
        }

        &.active {
            filter: brightness(1.2);
        }

        &:not(.disabled):not(.active) {
            cursor: pointer;
        }
    }

    .step-4-container {
        margin: 0;
        padding: 0;
        position: relative;
        left: -0.33em;

        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 1fr;
    }

    .step-1 {
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
    }

    .step-4-tutors {
        border-top-right-radius: 0.33em;
    }

    .step-4-hosts {
        border-bottom-right-radius: 0.33em;
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
    .step-3,
    .step-4-topics {
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

    .step-4-topics::before {
        width: 0.33em;
    }

    .step-4-tutors,
    .step-4-hosts {
        &::before {
            content: "";
            position: absolute;
            right: 100%;
            top: 0%;
            bottom: 0%;

            height: 100%;
            width: 0.8em;

            border-right: 0.4em solid var(--colour);
        }
    }

    .step-4-tutors::before {
        background: linear-gradient(
            to top right,
            transparent 50%,
            var(--colour) calc(50% + 1px)
        );
    }

    .step-4-hosts::before {
        background: linear-gradient(
            to bottom right,
            transparent 50%,
            var(--colour) calc(50% + 1px)
        );
    }
</style>
