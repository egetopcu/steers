<script lang="ts">
  import { query } from "../stores";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  $: if ($query.categories.length <= 0) {
    navigate("/interests");
  }
</script>

<div class="under-construction">
  <h4 class="title is-size-6">Not Implemented</h4>
  <blockquote>
    I'll get to it soon.
    <cite> - Karel</cite>
  </blockquote>
</div>
