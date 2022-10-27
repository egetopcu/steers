<script lang="ts">
  import Select from "svelte-select";
  import { getCategories, getProgrammes } from "../utils/api";

  import { query } from "../stores/query";
  import type { SelectChoices } from "../utils/types";
  import { mapChoices } from "../utils/helpers";
  import { Link } from "svelte-navigator";

  let choices: SelectChoices = [];

  $: updateChoices($query.programme);

  async function updateChoices(programme: number) {
    choices = await getCategories("", programme.toString()).then(mapChoices);
  }

  function onSelect(ev) {
    $query.categories = ev?.detail?.map((c) => parseInt(c.value));
  }
</script>

<div>
  <label for="categories" class="label">Select your interests...</label>
  <Select
    id="categories"
    isDisabled={!$query.programme}
    isMulti
    items={choices}
    on:select={onSelect}
    loadOptions={(q) =>
      getCategories(q, $query.programme.toString()).then(mapChoices)} />
</div>

<div id="goal">
  <Link to="/supervisors" class="button is-primary">Supervisor</Link>
  <Link to="/topics" class="button is-primary">Topic</Link>
  <Link to="/hosts" class="button is-primary">Host</Link>
</div>

<style lang="less">
  #goal {
    display: flex;
    flex-flow: row wrap;
    gap: 1em;
    margin-top: 1em;
    padding: 1em;
  }
</style>
