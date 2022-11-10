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
    import Debug from "./Debug.svelte";

    export let supervisor: TutorData;
    const _query = view(query, ($query) => $query);

    let details: any;
    let related_categories: CategoryData[] = [];
    let related_topics: TopicData[] = [];
    let related_clients: ClientData[] = [];

    $: update_people_details(supervisor);
    $: update_related_categories(supervisor, $query);
    $: update_related_clients(supervisor, $query);
    $: update_related_topics(supervisor, $query);

    async function update_people_details(tutor: TutorData) {
        if (tutor.mail === "NA") return;

        let response = await fetch(
            `https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(
                tutor.mail
            )}`
        );
        let data = await response.json();
        if (data?.data && data.data.length >= 1) {
            details = data.data[0];
        }
    }

    async function update_related_categories(tutor: TutorData, query: IQuery) {
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
    }

    async function update_related_topics(tutor: TutorData, query: IQuery) {
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
    }

    async function update_related_clients(tutor: TutorData, query: IQuery) {
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
    }
</script>

<div class="supervisor">
    <div class="details">
        <div class="name">
            {details?.name || supervisor.name} ({details?.givenName})
        </div>
        <div class="contact">
            {#if supervisor.mail != "NA"}
                <a href="mailto:{supervisor.mail}">{supervisor.mail}</a>
            {/if}
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
    <div class="department">
        {details?.organizations.map((org) => org.organizationId).join(", ")}
    </div>

    <div class="interests">
        {#if related_categories?.length}
            {#each related_categories as interest}
                <div class="interest">{interest.name}</div>
            {/each}
        {/if}
    </div>
    <div class="topics">
        {#if related_topics?.length}
            {#each related_topics as topic}
                <div class="topic">{topic.name}</div>
            {/each}
        {/if}
    </div>
    <div class="clients">
        {#if related_clients?.length}
            {#each related_clients as client}
                <div class="client">{client.name}</div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .supervisor {
        display: grid;

        grid-template-rows: min-content;
        grid-template-columns: 4fr 1fr repeat(3, 3fr);
    }
</style>
