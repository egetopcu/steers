<script lang="ts">
  import Select from "svelte-select";
  import { getTutors } from "../utils/api";
  import { mapChoices } from "../utils/helpers";
  import type { SelectChoices } from "../utils/types";

  export let programme: string;
  export let categories: string[];
  export let client: string = undefined;
  export let topics: string[] = [];

  export let tutors: string[] = [];
  export let choices: SelectChoices = [];

  $: {
    updateChoices(programme, categories, client, topics)
  }

  async function updateChoices(programme, categories, client, topics){
    choices = await getTutors("", programme, categories, topics, client).then(tutors => mapChoices(tutors, (el) => el.names[0]));
  }
</script>

<div class="field">
  <label for="tutors">Do you have supervisors in mind?</label>
  <Select
    id="tutors"
    bind:value={tutors}
    isMulti
    items={choices}
    loadOptions={(q) => getTutors(q, programme, categories, topics, client)}
  />
</div>
