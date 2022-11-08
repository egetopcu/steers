<script lang="ts">
    import Select from "svelte-select";
    import { getCategories } from "../utils/api";
    import { query } from "../stores";
    import type { CategoryData, ProgrammeData } from "@steers/common";
    import Debug from "./Debug.svelte";

    let categories: CategoryData[];

    // set up mapping for select choices to category data
    const optionIdentifier = "id";
    const labelIdentifier = "name";

    // update categories when programme selection changes
    $: updateChoices($query.programme);

    async function updateChoices(programme: ProgrammeData) {
        if (!programme) {
            categories = [];

            console.warn("attempted to get categories for NULL programme", {
                programme,
            });
            return;
        }

        categories = await getCategories("", programme);
    }

    function onSelect(ev) {
        $query.categories = ev?.detail ?? [];
    }
</script>

<div>
    <label for="categories" class="label">Select your interests...</label>
    <Select
        id="categories"
        isDisabled={!$query.programme}
        isMulti
        items={categories}
        value={$query.categories}
        {optionIdentifier}
        {labelIdentifier}
        on:select={onSelect}
        loadOptions={(q) => getCategories(q, $query.programme)}
    />

    <Debug
        label="Categories"
        data={{ selected: $query.categories, options: categories }}
    />
</div>
