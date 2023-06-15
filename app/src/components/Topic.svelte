<script lang="ts">
    import type {
        CategoryData,
        ClientData,
        TopicData,
        TutorData,
    } from "@bdsi-utwente/steers-common";
    import { IQuery, query } from "../stores";
    import {
        getCategories,
        getTutors,
        getTopics,
        getClients,
    } from "../utils/api";
    import { view } from "../utils/view";
    import EssayTableModal from "./EssayTableModal.svelte";

    import Debug from "./utility/Debug.svelte";
    import SkeletalTag from "./utility/SkeletalTag.svelte";

    export let topic: TopicData;
    const _query = view(query, ($query) => $query);

    let related_categories: CategoryData[] = [];
    let related_tutors: TutorData[] = [];
    let related_clients: ClientData[] = [];

    let loading = {
        details: true,
        categories: true,
        tutors: true,
        clients: true,
    };

    $: update_related_clients(topic, $_query);
    $: update_related_tutors(topic, $_query);
    $: update_related_categories(topic, $_query);

    async function update_related_clients(topic: TopicData, query: IQuery) {
        related_clients = [];
        loading.clients = true;

        try {
            related_clients = await getClients({
                limit: 3,
                required: {
                    topics: [topic.id],
                },
                optional: {
                    programme: query.programme?.id,
                },
            });
        } finally {
            loading.clients = false;
        }
    }

    async function update_related_categories(topic: TopicData, query: IQuery) {
        related_categories = [];
        loading.categories = true;

        try {
            related_categories = await getTopics({
                limit: 3,
                required: {
                    topics: [topic.id],
                },
                optional: {
                    programme: query.programme?.id,
                },
            });
        } finally {
            loading.categories = false;
        }
    }

    async function update_related_tutors(topic: TopicData, query: IQuery) {
        related_tutors = [];
        loading.tutors = true;

        try {
            related_tutors = await getTutors({
                limit: 3,
                required: {
                    topics: [topic.id],
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

<div class="topic">
    <div class="details">
        <div class="name">{topic.name}</div>
        <slot name="details-extra" />
        <EssayTableModal focus={{ topics: [topic.id] }} />
        <Debug
            label="topic"
            data={{
                topic,
                related_categories,
                related_tutors,
                related_clients,
            }}
        />
    </div>

    <div class="similar-resources">
        <div class="interestes tag-list">
            <iconify-icon
                icon="ph:puzzle-piece-light"
                title="interests - other interests in which this topic is mentioned"
            />
            {#if loading.categories}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_categories as category}
                    <div class="category tag">{category.name}</div>
                {/each}
            {/if}
        </div>
        <div class="tutors tag-list">
            <iconify-icon
                icon="ph:user-light"
                title="supervisors - relevant tutors that have previously supervised theses with this topic"
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
                title="hosts - relevant host organizations that have previously hosted students doing a thesis with this topic"
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
    .topic {
        padding: 0.5em;
        display: flex;
        flex-flow: row nowrap;

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
