<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { TopicData } from "@steers/common";
    import { getTopics } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Paginator from "./utility/Paginator.svelte";
    import Topic from "./Topic.svelte";
    import StarButton from "./StarButton.svelte";
    import Loading from "./utility/Loading.svelte";
    import NoResults from "./utility/NoResults.svelte";

    let loading = true;
    let filter: string = "";
    let page = 1;
    let choices: TopicData[] = [];
    let available: TopicData[] = [];
    $: available = differenceBy(choices, $query.topics, "id");

    let suggestions: TopicData[] = [];
    $: suggestions = available.slice((page - 1) * 10, page * 10);

    let pages: number;
    $: pages = Math.ceil(available.length / 10);

    async function updateChoices(filter: string, query: IQuery) {
        loading = true;
        choices = await getTopics({
            filter,
            required: {
                programme: query.programme?.id,
            },
            optional: {
                categories: query.categories?.map((c) => c.id),
                topics: query.topics?.map((t) => t.id),
                tutors: query.tutors?.map((t) => t.id),
                clients: query.clients?.map((t) => t.id),
            },
            // sort: "similarity DESC",
        });
        loading = false;
    }

    const debouncedUpdate = debounce(updateChoices, 1000, {
        maxWait: 5000,
        leading: false,
        trailing: true,
    });
    $: debouncedUpdate(filter, $query);

    function addTopic(topic: TopicData) {
        $query.topics = [...($query.topics ?? []), topic];
    }

    function removeTopic(topic: TopicData) {
        $query.topics = $query.topics.filter(
            (_topic) => _topic.id !== topic.id
        );
    }
</script>

<div class="select-topics">
    {#if $query.topics?.length}
        <div class="box">
            <div class="subtitle is-4">Selected topics</div>
            {#each $query.topics as topic}
                <Topic {topic}>
                    <StarButton
                        slot="details-extra"
                        label="Remove from search"
                        on:click={() => removeTopic(topic)}
                        active={true}
                    />
                </Topic>
            {/each}
        </div>
    {/if}

    <div class="box">
        <div class="subtitle is-4">Find topics</div>
        <div class="field">
            <p class="control has-icons-left">
                <input
                    class="input"
                    bind:value={filter}
                    type="text"
                    id="query"
                    name="query"
                    placeholder="filter by name"
                />
                <span class="icon is-small is-left">
                    <iconify-icon
                        icon="ph:magnifying-glass-bold"
                        title="search topics"
                    />
                </span>
            </p>
        </div>

        <div class="subtitle is-5">Matching topics</div>
        {#if suggestions?.length}
            <Paginator bind:page max_page={pages} />
            <div class="topic-table">
                {#each suggestions as topic}
                    <Topic {topic}>
                        <StarButton
                            slot="details-extra"
                            label="Add to search"
                            on:click={() => addTopic(topic)}
                        />
                    </Topic>
                {/each}
            </div>
            <Paginator bind:page max_page={pages} />
        {:else if loading}
            <Loading label="topics" />
        {:else}
            <NoResults label="topics" />
        {/if}
    </div>
</div>

<style lang="less">
    .select-topics {
        display: flex;
        flex-flow: column;
    }
</style>
