<script lang="ts">
  import ChooseGoal from "./components/ChooseGoal.svelte";
  import SelectCategories from "./components/SelectCategories.svelte";
  import SelectClient from "./components/SelectClient.svelte";
  import SelectProgramme from "./components/SelectProgramme.svelte";
  import SelectSupervisor from "./components/SelectSupervisor.svelte";
  import SelectTopic from "./components/SelectTopic.svelte";
  import ExploreSupervisors from "./components/ExploreSupervisors.svelte";
  import ExploreTopics from "./components/ExploreTopics.svelte";
  import EssayTable from "./components/EssayTable.svelte";

  let programme = null;
  let categories = [];
  let goal = null;
  let tutors = [];
  let topics = [];
  let client = null;
</script>

<main>
  <div class="container">
    <h1>Steers</h1>
    <form action="" class="form" on:submit|preventDefault>
      <SelectProgramme bind:programme />
      <SelectCategories bind:categories {programme} />
      <ChooseGoal
        bind:goal
        enabled={programme && categories && categories.length > 0}
      />
      {#if goal}
        <div id="additional-filters" class="row">
          {#if goal !== "supervisor"}
            <SelectSupervisor
              bind:tutors
              {categories}
              {programme}
              {topics}
              {client}
            />
          {/if}
          {#if goal !== "topic"}
            <SelectTopic
              bind:topics
              {categories}
              {programme}
              {tutors}
              {client}
            />
          {/if}
          {#if goal !== "client"}
            <SelectClient
              bind:client
              {categories}
              {programme}
              {tutors}
              {topics}
            />
          {/if}
        </div>
        {#if goal === "supervisor"}
          <ExploreSupervisors {categories} {programme} {client} {topics} />
        {/if}
        {#if goal === "topic"}
          <ExploreTopics
            {categories}
            {programme}
            supervisors={tutors}
            {client}
          />
        {/if}
        {#if goal === "client"}
          <!-- <ExploreClients {categories} {programme} {tutors} {topics} /> -->
        {/if}
      {/if}
      <h2>Query</h2>
      <code style="text-align: left;">
        <pre>{JSON.stringify({ programme, categories, goal, tutors, client, topics }, null, 2 )}</pre>
      </code>
      <h2>Essays</h2>
      <EssayTable {categories} {programme} {client} {topics} {tutors} />
    </form>
  </div>
</main>

<style lang="less">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    gap: 1em;

    :global(& *) {
      width: 100%;
    }
  }
</style>
