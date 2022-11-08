<script lang="ts">
  import { query } from "../stores";
  import { getCategories } from "../utils/api";
  import type { CategoryData, ProgrammeData } from "@steers/common";
  import Debug from "./Debug.svelte";

  let similar_categories: CategoryData[] = [];
  let loading: boolean = false;

  // update categories when programme or other selected categories change
  $: updateChoices($query.programme, $query.categories);

  async function updateChoices(
    programme: ProgrammeData,
    categories: CategoryData[]
  ) {
    if (!programme) {
      categories = [];

      console.warn("attempted to get categories for NULL programme", {
        programme,
      });
      return;
    }

    try {
      loading = true;
      similar_categories = (
        await getCategories("", programme, $query.categories)
      )
        .filter((category) => {
          return (
            category.similarity &&
            category.similarity >= 1 &&
            !$query.categories.find((selected) => selected.id === category.id)
          );
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 6);
    } finally {
      loading = false;
    }
  }

  function addCategory(category: CategoryData) {
    $query.categories = [...$query.categories, category];
  }
</script>

{#if $query.categories?.length}
  <div class="similar-interests mt-4">
    <div class="label">You may also be interested in...</div>
    <div class="similar-interests-list">
      {#each similar_categories as similar}
        <button
          on:click={() => addCategory(similar)}
          class="similar-interest button is-small is-info"
          class:is-loading={loading}
          disabled={loading ? true : null}>
          {similar.name}
        </button>
      {/each}
    </div>

    <Debug label="Similarity" data={similar_categories} />
  </div>
{/if}

<style lang="less">
  .similar-interests-list {
    display: flex;
    flex-flow: row wrap;
    gap: 0.2em;
  }
</style>
