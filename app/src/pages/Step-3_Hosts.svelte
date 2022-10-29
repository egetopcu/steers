<script lang="ts">
  import { query } from "../stores";
  import { useNavigate } from "svelte-navigator";
  import SelectHosts from "../components/SelectHosts.svelte";
  import type { ClientData } from "@steers/common";

  const navigate = useNavigate();
  $: if ($query.categories.length <= 0) {
    navigate("/interests");
  }

  let hosts: ClientData[] = [];
</script>

<div class="select-hosts">
  <SelectHosts {hosts} bind:selected={$query.clients} />
</div>
