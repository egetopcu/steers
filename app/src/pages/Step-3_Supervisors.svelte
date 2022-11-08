<script lang="ts">
  import { query } from "../stores";
  import { useNavigate } from "svelte-navigator";
  import SelectSupervisors from "../components/SelectSupervisors.svelte";

  const navigate = useNavigate();

  $: if ($query.categories.length <= 0) {
    navigate("/interests");
  }
</script>

<div class="under-construction">
  <h4 class="title is-size-6">Find your supervisor...</h4>
  <SelectSupervisors />
</div>
