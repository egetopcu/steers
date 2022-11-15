<script lang="ts">
    import type {
        CategoryData,
        ClientData,
        TopicData,
        TutorData,
    } from "@steers/common";
    import { IQuery, query } from "../stores";
    import { getCategories, getClients, getTopics } from "../utils/api";
    import { view } from "../utils/view";

    import Debug from "./utility/Debug.svelte";
    import SkeletalTag from "./utility/SkeletalTag.svelte";

    export let supervisor: TutorData;
    const _query = view(query, ($query) => $query);

    let details: any;
    let related_categories: CategoryData[] = [];
    let related_topics: TopicData[] = [];
    let related_clients: ClientData[] = [];

    let loading = {
        details: true,
        categories: true,
        topics: true,
        clients: true,
    };

    $: update_people_details(supervisor);
    $: update_related_categories(supervisor, $query);
    $: update_related_clients(supervisor, $query);
    $: update_related_topics(supervisor, $query);

    async function update_people_details(tutor: TutorData) {
        details = undefined;
        loading.details = true;
        if (tutor.mail === "NA") return;

        try {
            let response = await fetch(
                `https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(
                    tutor.mail
                )}`
            );
            let data = await response.json();
            if (data?.data && data.data.length >= 1) {
                details = data.data[0];
            }
        } finally {
            loading.details = false;
        }
    }

    async function update_related_categories(tutor: TutorData, query: IQuery) {
        related_categories = [];
        loading.categories = true;

        try {
            related_categories = await getCategories({
                limit: 3,
                required: {
                    tutors: [tutor.id],
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

    async function update_related_topics(tutor: TutorData, query: IQuery) {
        related_topics = [];
        loading.topics = true;

        try {
            related_topics = await getTopics({
                limit: 3,
                required: {
                    tutors: [tutor.id],
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

    async function update_related_clients(tutor: TutorData, query: IQuery) {
        related_clients = [];
        loading.clients = true;

        try {
            related_clients = await getClients({
                limit: 3,
                required: {
                    tutors: [tutor.id],
                },
                optional: {
                    programme: query.programme?.id,
                    categories: query.categories?.map((c) => c.id),
                },
            });
        } finally {
            loading.clients = false;
        }
    }
</script>

<div class="supervisor">
    <div class="details">
        <div class="name">
            {details?.name || supervisor.name}{details?.givenName
                ? " (" + details.givenName + ")"
                : ""}
        </div>
        <div class="contact">
            {#if supervisor.mail != "NA"}
                <a href="mailto:{supervisor.mail}">{supervisor.mail}</a>
            {/if}
        </div>
        <div class="department">
            {details?.organizations
                .map((org) => org.organizationId)
                .join(", ") ?? ""}
        </div>
        <Debug
            label="details"
            data={{
                supervisor,
                details,
                related_categories,
                related_clients,
                related_topics,
            }}
        />
    </div>

    <div class="similar-resources">
        <div class="interests tag-list">
            <iconify-icon
                icon="ph:books-light"
                title="interests - relevant research areas for theses supervised by this person"
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
                title="topics - relevant topics mentioned in theses supervised by this person"
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
                icon="ph:buildings-light"
                title="host organizations - organizations that this supervisor has cooperated with for previous theses."
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
    .supervisor {
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
