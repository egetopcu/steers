<script lang="ts">
    import type {
        CategoryData,
        ClientData,
        TopicData,
        TutorData,
    } from "@steers/common";
    import { IQuery, query } from "../stores";
    import { getTutors, getTopics, getClients } from "../utils/api";
    import { view } from "../utils/view";
    import EssayTableModal from "./EssayTableModal.svelte";

    import Debug from "./utility/Debug.svelte";
    import SkeletalTag from "./utility/SkeletalTag.svelte";

    export let category: CategoryData;
    const _query = view(query, ($query) => $query);

    let related_topics: TopicData[] = [];
    let related_tutors: TutorData[] = [];
    let related_clients: ClientData[] = [];

    let loading = {
        details: true,
        topics: true,
        tutors: true,
        clients: true,
    };

    $: update_related_clients(category, $_query);
    $: update_related_tutors(category, $_query);
    $: update_related_topics(category, $_query);

    async function update_related_clients(
        category: CategoryData,
        query: IQuery
    ) {
        related_clients = [];
        loading.clients = true;

        try {
            related_clients = await getClients({
                limit: 3,
                required: {
                    categories: [category.id],
                },
                optional: {
                    programme: query.programme?.id,
                },
            });
        } finally {
            loading.clients = false;
        }
    }

    async function update_related_topics(
        category: CategoryData,
        query: IQuery
    ) {
        related_topics = [];
        loading.topics = true;

        try {
            related_topics = await getTopics({
                limit: 3,
                required: {
                    categories: [category.id],
                },
                optional: {
                    programme: query.programme?.id,
                },
            });
        } finally {
            loading.topics = false;
        }
    }

    async function update_related_tutors(
        category: CategoryData,
        query: IQuery
    ) {
        related_tutors = [];
        loading.tutors = true;

        try {
            related_tutors = await getTutors({
                limit: 3,
                required: {
                    categories: [category.id],
                },
                optional: {
                    programme: query.programme?.id,
                },
            });
        } finally {
            loading.tutors = false;
        }
    }
</script>

<div class="category">
    <div class="details">
        <div class="name">{category.name}</div>
        <slot name="details-extra" />
        <EssayTableModal focus={{ categories: [category.id] }} />
        <Debug
            label="category"
            data={{
                category,
                related_topics,
                related_tutors,
                related_clients,
            }}
        />
    </div>

    <div class="similar-resources">
        <div class="topics tag-list">
            <iconify-icon
                icon="ph:puzzle-piece-light"
                title="topics - relevant topics mentioned by other students with this interest"
            />
            {#if loading.topics}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_topics as topic}
                    <div class="topic tag">{topic.name}</div>
                {/each}
            {/if}
        </div>
        <div class="tutors tag-list">
            <iconify-icon
                icon="ph:user-light"
                title="supervisors - relevant tutors that have previously supervised students with this interest"
            />
            {#if loading.tutors}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_tutors as tutor}
                    <div class="tutor tag">{tutor.name}</div>
                {/each}
            {/if}
        </div>
        <div class="clients tag-list">
            <iconify-icon
                icon="ph:buildings-light"
                title="hosts - relevant host organizations that have previously hosted students with this interest"
            />
            {#if loading.clients}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_clients as client}
                    <div class="client tag">{client.name}</div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style lang="less">
    .category {
        padding: 0.5em;
        display: flex;
        flex-flow: row nowrap;
        min-width: max-content;

        &:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.02);
        }

        .details {
            flex: calc(min(33%, 250px)) 0 0;
        }

        .similar-resources {
            flex: min-content 1 1;
        }

        .tag-list {
            display: flex;
            flex-flow: row wrap;
            gap: 0.2rem;
            margin: 0.2rem;
            align-items: center;
            align-content: flex-start;
            justify-content: flex-start;
        }
    }
</style>
