<script lang="ts">
  import { onMount } from "svelte";
  import Select from "svelte-select";
  import { getProgrammes } from "../utils/api";
  import { getChoice, mapChoices } from "../utils/helpers";
  import type { SelectChoices } from "../utils/types";

  export let choices: SelectChoices = [];
  export let programme: string;

  function onSelect(ev) {
    programme = ev?.detail?.value;
  }

  onMount(async () => {
    choices = await getProgrammes("").then(mapChoices);
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
