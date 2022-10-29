<script lang="ts">
  import type { ClientData } from "@steers/common";
  import Select from "svelte-select";

  const optionIdentifier = "id";
  const labelIdentifier = "name";

  export let hosts: ClientData[];
  export let selected: ClientData[] = [];
  export let filter: string = "";

  const onSelect = (ev) => {
    selected = ev.details;
  };
</script>

<code>{JSON.stringify({ filter })}</code>
<Select
  items={hosts}
  value={selected}
  {optionIdentifier}
  {labelIdentifier}
  bind:filterText={filter}
  on:select={onSelect} />
