<script lang="ts">
  import { getTutors } from "../utils/api";
  import { IQuery, query } from "../stores";
  import differenceBy from "lodash/differenceBy";
  import type { TutorData } from "@steers/common";
  import Debug from "./Debug.svelte";
  import Supervisor from "./Supervisor.svelte";

  let supervisors: TutorData[];
  let filter: string = "";

  let suggestions: TutorData[] = [];
  $: suggestions = differenceBy(supervisors, $query.tutors, "id");

  async function updateChoices(query: IQuery) {
    supervisors = await getTutors(filter, query);
  }
  $: updateChoices($query);
</script>

<div class="select-supervisors">
  {#each $query.tutors as supervisor}
    <Supervisor {supervisor} />
  {/each}
  {#each suggestions as supervisor}
    <Supervisor {supervisor} />
  {/each}
</div>
