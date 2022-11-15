<script lang="ts">
    import Select from "svelte-select";

    import type { CategoryData } from "@steers/common";
    import { getCategories } from "../utils/api";
    import { IQuery, query } from "../stores";
    import { view } from "../utils/view";

    import Debug from "./utility/Debug.svelte";

    let choices: CategoryData[];

    let programme = view(
        query,
        ($query) => $query.programme,
        (a, b) => a?.id === b?.id
    );

    // set up mapping for select choices to category data
    const optionIdentifier = "id";
    const labelIdentifier = "name";

    $: updateChoices({ programme: $programme });
    async function updateChoices({ programme }: IQuery) {
        console.log({ programme });

        choices = await getCategories({
            required: { programme: programme?.id },
        });
    }
</script>

<div>
    <label for="categories" class="label">Select your interests...</label>
    <Select
        id="categories"
        isDisabled={!$query.programme}
        isMulti
        items={choices}
        bind:value={$query.categories}
        {optionIdentifier}
        {labelIdentifier}
    />

    <Debug
        label="Categories"
        data={{ selected: $query.categories, options: choices }}
    />
</div>
