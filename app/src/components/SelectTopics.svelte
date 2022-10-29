<script lang="ts">
  import type { TopicData } from "@steers/common";

  export let topics: TopicData[];
  export let selected: TopicData[];

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

<div class="topics">
  {#each topics as topic}
    <a
      class="topic tag"
      class:is-primary={selected.find((cur) => cur.id === topic.id)}
      on:click={toggleTopicFunction(topic)}
      on:keypress={toggleTopicFunction(topic)}
      href="#">
      {topic.name}
    </a>
  {/each}
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
