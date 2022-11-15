<script lang="ts">
    import differenceBy from "lodash/differenceBy";

    import type { TopicData } from "@steers/common";

    import Debug from "./utility/Debug.svelte";

    export let selected: TopicData[] = [];
    export let topics: TopicData[] = [];
    export let loading: boolean = false;

    let suggestions: TopicData[];
    $: suggestions = differenceBy(topics ?? [], selected ?? [], "id");

    const toggleTopicFunction = (topic: TopicData) => {
        return (ev) => {
            ev.preventDefault();
            if (selected.find((cur) => cur.id === topic.id)) {
                // remove topic
                selected = selected.filter((cur) => cur.id !== topic.id);
            } else {
                // add to topics
                selected = [...selected, topic];
            }
        };
    };
</script>

<div class="select-topics">
    <div class="topics" class:loading>
        {#each selected as topic}
            <button
                class="topic button is-primary is-small"
                on:click={toggleTopicFunction(topic)}
                on:keypress={toggleTopicFunction(topic)}
                disabled={loading ? true : null}
            >
                {topic.name}
            </button>
        {/each}
        {#each suggestions as topic}
            <button
                class="topic button is-small"
                class:is-primary={selected.find((cur) => cur.id === topic.id)}
                on:click={toggleTopicFunction(topic)}
                on:keypress={toggleTopicFunction(topic)}
                disabled={loading ? true : null}
                class:is-loading={loading}
            >
                {topic.name}
            </button>
        {/each}
    </div>
    <Debug label="Topics" data={{ selected, choices: topics }} />
</div>

<style lang="less">
    .topics {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.2em;
    }

    .topic {
        cursor: pointer;
    }
</style>
