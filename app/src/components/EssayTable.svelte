<script lang="ts">
  import { getEssays } from "../utils/api";
  import { Datatable } from "svelte-simple-datatables";

  export let programme;
  export let categories;
  export let client;
  export let tutors;
  export let topics;

  const settings = {
    sortable: true,
    pagination: true,
    rowsPerPage: 25,
  };

  let essays: Awaited<ReturnType<typeof getEssays>> = [];
  let rows;

  async function updateEssays(programme, categories, client, tutors, topics) {
    essays = await getEssays(programme, categories, topics, tutors, client);
  }

  $: {
    updateEssays(programme, categories, client, tutors, topics);
  }
</script>

<div id="essay-table">
  <Datatable {settings} data={essays} bind:dataRows={rows}>
    <thead>
      <th data-key="author">Author</th>
      <th data-key="title">Title</th>
      <th>Supervisors</th>
      <th data-key="(row) => row.programme.name">Programme</th>
      <th>Categories</th>
      <th>Topics</th>
      <th data-key="(row) => row.client.name">Client</th>
    </thead>
    <tbody>
      {#if rows}
        {#each $rows as row}
          <tr>
            <td>{row.author}</td>
            <td>{row.title}</td>
            <td>{row.tutors?.map((t) => t.names[0]).join(", ")}</td>
            <td>{row.programme?.name}</td>
            <td>{row.categories?.map((c) => c.name).join(", ")}</td>
            <td>{row.topics?.map((t) => t.name).join(", ")}</td>
            <td>{row.client?.name}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </Datatable>
</div>

<style lang="less">
    #essay-table {
        min-height: 500px;
        width: 100%;
    }
</style>
