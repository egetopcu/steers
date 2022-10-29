<script lang="ts">
  import Select from "svelte-select";
  import { getProgrammes } from "../utils/api";
  import type { ProgrammeData } from "@steers/common";
  import { breadcrumbs, query } from "../stores";
  import { onMount } from "svelte";

  const optionIdentifier = "id";
  const labelIdentifier = "name";
  let programmes: ProgrammeData[];

  function onSelect(ev) {
    $query.programme = ev.detail;
  }

  onMount(async () => {
    programmes = await getProgrammes("");
  });
</script>

<div class="field">
  <label for="programme" class="label">Select study programme...</label>
  <Select
    id="programme"
    items={programmes}
    value={$query.programme}
    {optionIdentifier}
    {labelIdentifier}
    on:select={onSelect} />
</div>
