<script lang="ts">
  import type { CategoryData, TutorData } from "@steers/common";
  import { getCategories } from "../utils/api";
  import Debug from "./Debug.svelte";

  export let supervisor: TutorData;

  let details: any;
  $: fetchDetails(supervisor);
  async function fetchDetails(supervisor: TutorData) {
    let response = await fetch(
      `https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(
        supervisor.mail
      )}`
    );
    let data = await response.json();
    if (data?.data && data.data.length >= 1) {
      details = data.data[0];
    }
  }

  let interests: CategoryData[] = [];
  $: fetchInterests(supervisor);
  async function fetchInterests(supervisor: TutorData) {
    interests = await getCategories("", { tutors: [supervisor] });
  }
</script>

<div class="supervisor">
  <div class="name">
    {details?.name || supervisor.name} ({details?.givenName})
  </div>
  {#if details}
    <div class="department">
      {details?.organizations.map((org) => org.organizationId).join(", ")}
    </div>
  {/if}
  {#if supervisor.mail != "NA"}
    <div class="contact">
      <a href="mailto:{supervisor.mail}">{supervisor.mail}</a>
    </div>
  {/if}
  <Debug label="details" data={{ supervisor, details }} />
</div>
