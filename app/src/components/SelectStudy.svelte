<script lang="ts">
    import Select from "svelte-select";
    import { onMount } from "svelte";

    import type { ProgrammeData } from "@steers/common";
    import { getProgrammes } from "../utils/api";
    import { query } from "../stores";

    const optionIdentifier = "id";
    const labelIdentifier = "name";
    let programmes: ProgrammeData[];

    onMount(async () => {
        programmes = await getProgrammes({ sort: "programme.name" });
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
