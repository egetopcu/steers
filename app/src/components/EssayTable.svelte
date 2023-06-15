<script lang="ts">
    import type { EssayData } from "@bdsi-utwente/steers-common";
    import { IQuery, query } from "../stores/query";
    import type { QueryData } from "@bdsi-utwente/steers-common";
    import { getEssays } from "../utils/api";
    import { format } from "date-fns";
    import Loading from "./utility/Loading.svelte";
    import NoResults from "./utility/NoResults.svelte";

    export let focus: QueryData["required"] = undefined;
    let essays: EssayData[] = [];
    let loading = true;

    async function updateEssays(query: IQuery, focus?: QueryData["required"]) {
        loading = true;
        const querydata: QueryData = {
            required: {
                programme: query.programme?.id,
                ...focus,
            },
            optional: {},
        };

        if (query.categories) {
            querydata.optional.categories = query.categories.map((c) => c.id);
        }
        if (query.clients) {
            querydata.optional.clients = query.clients.map((c) => c.id);
        }
        if (query.topics) {
            querydata.optional.topics = query.topics.map((t) => t.id);
        }
        if (query.tutors) {
            querydata.optional.tutors = query.tutors.map((t) => t.id);
        }

        essays = await getEssays(querydata);
        loading = false;
    }

    $: updateEssays($query, focus);
</script>

<div class="essay-table">
    {#if !essays?.length}
        {#if loading}
            <Loading label="essays" />
        {:else}
            <NoResults label="essays" />
        {/if}
    {/if}
    {#each essays as essay}
        <div class="essay-row">
            <div class="title is-6">{essay.title}</div>
            <div class="subtitle is-6 mb-0">
                <span class="author">{essay.author}</span>,
                <span class="date"
                    >{format(new Date(essay.date.toString()), "yyyy")}</span
                >.
                <span class="programme">{essay.programme?.name}</span>
            </div>
            <a
                href={"https://purl.utwente.nl/essays/" + essay.id}
                class="essay-link is-size-7 mb-1"
                target="_blank"
                rel="noreferrer">https://purl.utwente.nl/essays/{essay.id}</a
            >

            {#if essay.tutors?.length}
                <div class="tag-list-container">
                    <iconify-icon icon="ph:user-light" title="supervisors" />
                    <div class="tag-list tutors">
                        {#each essay.tutors as tutor}
                            <span class="tag">{tutor.name}</span>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if essay.clients?.length}
                <div class="tag-list-container">
                    <iconify-icon
                        icon="ph:buildings-light"
                        title="host organization(s)"
                    />
                    <div class="tag-list hosts">
                        {#each essay.clients as host}
                            <span class="tag">{host.name}</span>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if essay.categories?.length}
                <div class="tag-list-container">
                    <iconify-icon icon="ph:books-light" title="interests" />
                    <div class="tag-list interests">
                        {#each essay.categories as category}
                            <span class="tag">{category.name}</span>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if essay.topics?.length}
                <div class="tag-list-container">
                    <iconify-icon icon="ph:puzzle-piece-light" title="topics" />
                    <div class="tag-list topics">
                        {#each essay.topics as topic}
                            <span class="tag">{topic.name}</span>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>

<style lang="less">
    .essay-table {
        .essay-row {
            padding: 1em;

            & + .essay-row {
                margin-top: 0.5em;
            }
        }

        .tag-list-container {
            display: flex;
            flex-flow: row nowrap;
            align-items: baseline;
            width: 100%;

            .tag-list {
                flex: 1 0 auto;
                display: flex;
                flex-flow: row wrap;
                gap: 0.2rem;
                margin: 0.2rem;
                align-items: center;
                align-content: flex-start;
                justify-content: flex-start;
                max-width: calc(100% - 1.5em);
            }

            iconify-icon {
                flex: 0 0 min-content;

                // I'm sure there's a better way to align icons and tags, but this works.
                top: 3px;
                position: relative;
            }
        }
    }
</style>
