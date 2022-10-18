<script lang="ts">
    import Select from "svelte-select";
    import { getCategories } from "../utils/api";
    import { mapChoices } from "../utils/helpers";
    import type { SelectChoices } from "../utils/types";

    export let programme: string | undefined;
    export let categories: string[];
    export let choices: SelectChoices = [];

    $: {
        updateChoices(programme);
    }
    async function updateChoices(programme: string) {
        choices = await getCategories("", programme).then(mapChoices);
    }
    function onSelect(ev) {
        categories = ev?.detail?.map((c) => c.value);
    }
</script>

<div class="field">
    <label for="category">Choose your field(s) of interest</label>
    <Select
        id="category"
        isDisabled={!programme}
        isMulti
        items={choices}
        on:select={onSelect}
        loadOptions={(q) => getCategories(q, programme).then(mapChoices)}
    />
</div>
