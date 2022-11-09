<script lang="ts">
    import Select from "svelte-select";
    import { getProgrammes } from "../utils/api";
    import type { ProgrammeData } from "@steers/common";
    import { query } from "../stores";
    import { onMount } from "svelte";

    const optionIdentifier = "id";
    const labelIdentifier = "name";
    let programmes: ProgrammeData[];

    onMount(async () => {
        programmes = await getProgrammes({});
    });
</script>

<div class="field">
    <label for="programme" class="label">Select study programme...</label>
    <Select
        id="programme"
        items={programmes}
        bind:value={$query.programme}
        {optionIdentifier}
        {labelIdentifier}
    />
</div>
