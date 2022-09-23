<script lang="ts">
    import { onMount } from "svelte";
    import Select from "svelte-select";
    import { getProgrammes } from "../utils/api";
    import type { SelectChoices } from "../utils/types";

    export let choices: SelectChoices = [];
    export let programme = null;

    function onSelect(ev) {
        programme = ev?.detail?.value;
    }

    onMount(() => {
        getProgrammes("").then((p) => (choices = p));
    });
</script>

<div class="field">
    <label for="programme">Choose your study programme</label>
    <Select
        id="programme"
        items={choices}
        on:select={onSelect}
        loadOptions={getProgrammes}
    />
</div>
