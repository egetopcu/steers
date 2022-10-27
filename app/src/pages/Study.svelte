<script lang="ts">
  import { onMount } from "svelte";
  import Select from "svelte-select";
  import { useNavigate } from "svelte-navigator";

  import { query } from "../stores/query";
  import type { SelectChoices } from "../utils/types";
  import { getProgrammes } from "../utils/api";
  import { mapChoices } from "../utils/helpers";

  const navigate = useNavigate();
  let choices: SelectChoices = [];

  function onSelect(ev) {
    $query.programme = parseInt(ev?.detail?.value);
    navigate("/interests");
  }

  onMount(async () => {
    choices = await getProgrammes("").then(mapChoices);
  });
</script>

<div class="field">
  <label for="programme" class="label">Select study programme...</label>
  <Select
    id="programme"
    items={choices}
    on:select={onSelect}
    loadOptions={getProgrammes} />
</div>
