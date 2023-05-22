<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { CategoryData } from "@steers/common";
    import { getCategories } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Paginator from "./utility/Paginator.svelte";
    import Category from "./Category.svelte";
    import StarButton from "./StarButton.svelte";
    import Loading from "./utility/Loading.svelte";
    import NoResults from "./utility/NoResults.svelte";

    let filter: string = "";
    let page = 1;
    let choices: CategoryData[] = [];
    let available: CategoryData[] = [];
    $: available = differenceBy(choices, $query.categories, "id");

    let suggestions: CategoryData[] = [];
    $: suggestions = available.slice((page - 1) * 10, page * 10);

    let pages: number;
    $: pages = Math.ceil(available.length / 10);

    let loading = true;

    async function updateChoices(filter: string, query: IQuery) {
        loading = true;
        choices = await getCategories({
            filter,
            required: {
                programme: query.programme?.id,
            },
            optional: {
                categories: query.categories?.map((c) => c.id),
                topics: query.topics?.map((t) => t.id),
                tutors: query.tutors?.map((t) => t.id),
                clients: query.clients?.map((t) => t.id),
            },
            // sort: "similarity DESC",
        });
        loading = false;
    }

    const debouncedUpdate = debounce(updateChoices, 1000, {
        maxWait: 5000,
        leading: false,
        trailing: true,
    });
    $: debouncedUpdate(filter, $query);

    function addCategory(category: CategoryData) {
        $query.categories = [...($query.categories ?? []), category];
    }

    function removeCategory(category: CategoryData) {
        $query.categories = $query.categories.filter(
            (_category) => _category.id !== category.id
        );
    }
</script>

<div class="select-categories">
    {#if $query.categories?.length}
        <div class="box">
            <h2 class="subtitle is-4">Selected interests</h2>
            {#each $query.categories as category}
                <Category {category}>
                    <StarButton
                        slot="details-extra"
                        label="Remove from search"
                        on:click={() => removeCategory(category)}
                        active={true}
                    />
                </Category>
            {/each}
        </div>
    {/if}

    <div class="box">
        <div class="subtitle is-4">Find interests</div>
        <div class="field">
            <p class="control has-icons-left">
                <input
                    class="input"
                    bind:value={filter}
                    type="text"
                    id="query"
                    name="query"
                    placeholder="filter by name"
                />
                <span class="icon is-small is-left">
                    <iconify-icon
                        icon="ph:magnifying-glass-bold"
                        title="search interests"
                    />
                </span>
            </p>
        </div>
        {#if suggestions?.length}
            <div class="subtitle is-5">Matching interests</div>
            <Paginator bind:page max_page={pages} />
            <div class="category-table">
                {#each suggestions as category}
                    <Category {category}>
                        <StarButton
                            slot="details-extra"
                            label="Add to search"
                            on:click={() => addCategory(category)}
                        />
                    </Category>
                {/each}
            </div>
            <Paginator bind:page max_page={pages} />
        {:else if loading}
            <Loading label="interests" />
        {:else}
            <NoResults label="interests" />
        {/if}
    </div>
</div>

<style lang="less">
    .select-categories {
        display: flex;
        flex-flow: column;
    }
</style>
