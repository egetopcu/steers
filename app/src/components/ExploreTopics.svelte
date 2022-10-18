<script lang="ts">
import type { TopicData } from "@steers/common";
import { getTopics } from "../utils/api";
import Topic from "./Topic.svelte";

    export let programme;
    export let categories;
    export let client;
    export let supervisors;
    
    // todo: query supervisors from API
    let topics: TopicData[] = [];

    $: {
        updateTopics(programme, categories, client, supervisors);
    }

    async function updateTopics(programme, categories, client, supervisors) {
        topics = await getTopics("", programme, categories, supervisors, client)
    }
</script>

<style lang="less">
    .explore-topics {
        margin-top: 1em;
        display: flex;
        flex-flow: row wrap;
        gap: 0.5em;

        justify-content: center;
        align-items: center;

        padding: .5em;
        border: 1px solid #d8dbdf;
        border-radius: 3px;
    }
</style>

<div class="explore-topics">
    {#each topics as topic}
        <Topic {topic} />
    {/each}
</div>