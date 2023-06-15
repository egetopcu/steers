<script lang="ts">
    import type { CategoryData, ProgrammeData } from "@bdsi-utwente/steers-common";
    import { query } from "../stores";
    import { getCategories } from "../utils/api";
    import { view } from "../utils/view";

    import Debug from "./utility/Debug.svelte";

    let choices: CategoryData[] = [];
    let loading: boolean = false;

    const programme = view(
        query,
        (query) => query.programme,
        (a, b) => a?.id === b?.id
    );
    const selected = view(
        query,
        ($query) => $query.categories,
        (a, b) =>
            a?.length === b?.length &&
            a?.map((c) => c.id).join(":") === b?.map((c) => c.id).join(":")
    );

    // update categories when programme or other selected categories change
    $: updateChoices($programme, $selected);

    async function updateChoices(
        programme: ProgrammeData,
        categories: CategoryData[]
    ) {
        try {
            loading = true;
            choices = (
                await getCategories({
                    optional: {
                        programme: programme?.id,
                        categories: categories?.map((c) => c.id),
                    },
                })
            )
                .filter((category) => {
                    return (
                        category.similarity &&
                        category.similarity >= 1 &&
                        !$selected?.find(
                            (selected) => selected.id === category.id
                        )
                    );
                })
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 6);
        } finally {
            loading = false;
        }
    }

    function addCategory(category: CategoryData) {
        $query.categories = [...$query.categories, category];
    }
</script>

{#if $query.categories?.length}
    <div class="similar-interests mt-4">
        <div class="label">You may also be interested in...</div>
        <div class="similar-interests-list">
            {#each choices as similar}
                <button
                    on:click={() => addCategory(similar)}
                    class="similar-interest button is-small is-info"
                    class:is-loading={loading}
                    disabled={loading ? true : null}
                >
                    {similar.name}
                </button>
            {/each}
        </div>

        <Debug label="Similarity" data={choices} />
    </div>
{/if}

<style lang="less">
    .similar-interests-list {
        display: flex;
        flex-flow: row wrap;
        gap: 0.2em;
    }
</style>
