<script lang="ts">
  import Select from "svelte-select";
  import { getClients } from "../utils/api";
  import { mapChoices } from "../utils/helpers";
  import type { SelectChoices } from "../utils/types";

  export let programme: string;
  export let categories: string[];
  export let tutors: string[] = [];
  export let topics: string[] = [];

  export let client: string;
  export let choices: SelectChoices = [];

  $: {
    updateChoices(programme, categories, tutors, topics);
  }
  async function updateChoices(programme, categories, tutors, topics) {
    choices = await getClients("", programme, categories, topics, tutors).then(mapChoices);
  }
  function onSelect(ev) {
    client = ev?.detail?.value;
  }
</script>

<div class="field">
  <label for="client">Do you have a host organization in mind?</label>
  <Select
    id="client"
    items={choices}
    loadOptions={(q) => getClients(q, programme, categories, tutors, topics)}
    on:select={onSelect}
  />
</div>
