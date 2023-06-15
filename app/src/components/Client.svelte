<script lang="ts">
    import type {
        CategoryData,
        ClientData,
        TopicData,
        TutorData,
    } from "@bdsi-utwente/steers-common";
    import { IQuery, query } from "../stores";
    import { getCategories, getTutors, getTopics } from "../utils/api";
    import { view } from "../utils/view";
    import EssayTableModal from "./EssayTableModal.svelte";

    import Debug from "./utility/Debug.svelte";
    import SkeletalTag from "./utility/SkeletalTag.svelte";

    export let client: ClientData;
    const _query = view(query, ($query) => $query);

    let related_categories: CategoryData[] = [];
    let related_topics: TopicData[] = [];
    let related_tutors: TutorData[] = [];

    let loading = {
        details: true,
        categories: true,
        topics: true,
        tutors: true,
    };

    $: update_related_categories(client, $_query);
    $: update_related_tutors(client, $_query);
    $: update_related_topics(client, $_query);

    async function update_related_categories(
        client: ClientData,
        query: IQuery
    ) {
        related_categories = [];
        loading.categories = true;

        try {
            related_categories = await getCategories({
                limit: 3,
                required: {
                    clients: [client.id],
                },
                optional: {
                    programme: query.programme?.id,
                    categories: query.categories?.map((c) => c.id),
                },
            });
        } finally {
            loading.categories = false;
        }
    }

    async function update_related_topics(client: ClientData, query: IQuery) {
        related_topics = [];
        loading.topics = true;

        try {
            related_topics = await getTopics({
                limit: 3,
                required: {
                    clients: [client.id],
                },
                optional: {
                    programme: query.programme?.id,
                    categories: query.categories?.map((c) => c.id),
                },
            });
        } finally {
            loading.topics = false;
        }
    }

    async function update_related_tutors(client: ClientData, query: IQuery) {
        related_tutors = [];
        loading.tutors = true;

        try {
            related_tutors = await getTutors({
                limit: 3,
                required: {
                    clients: [client.id],
                },
                optional: {
                    programme: query.programme?.id,
                    categories: query.categories?.map((c) => c.id),
                },
            });
        } finally {
            loading.tutors = false;
        }
    }
</script>

<div class="client">
    <div class="details">
        <div class="name">{client.name}</div>
        <slot name="details-extra" />
        <EssayTableModal focus={{ clients: [client.id] }} />
        <Debug
            label="client"
            data={{
                client,
                related_categories,
                related_topics,
                related_tutors,
            }}
        />
    </div>

    <div class="similar-resources">
        <div class="interests tag-list">
            <iconify-icon
                icon="ph:books-light"
                title="interests - relevant research areas for theses preformed at this host organization"
            />
            {#if loading.categories}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_categories as interest}
                    <div class="interest tag">{interest.name}</div>
                {/each}
            {/if}
        </div>
        <div class="topics tag-list">
            <iconify-icon
                icon="ph:puzzle-piece-light"
                title="topics - relevant topics mentioned in theses performed at this host organization"
            />
            {#if loading.topics}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_topics as topic}
                    <div class="topic tag">{topic.name}</div>
                {/each}
            {/if}
        </div>
        <div class="clients tag-list">
            <iconify-icon
                icon="ph:user-light"
                title="supervisors - relevant tutors that have previously supervised theses performed at this host organization"
            />
            {#if loading.tutors}
                <SkeletalTag /><SkeletalTag /><SkeletalTag />
            {:else}
                {#each related_tutors as tutor}
                    <div class="client tag">{tutor.name}</div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style lang="less">
    .client {
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
