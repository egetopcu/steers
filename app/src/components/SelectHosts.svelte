<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { ClientData } from "@bdsi-utwente/steers-common";
    import { getClients } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Paginator from "./utility/Paginator.svelte";
    import Client from "./Client.svelte";
    import StarButton from "./StarButton.svelte";
    import Loading from "./utility/Loading.svelte";
    import NoResults from "./utility/NoResults.svelte";

    let loading = true;
    let filter: string = "";
    let page = 1;
    let choices: ClientData[] = [];
    let available: ClientData[] = [];
    $: available = differenceBy(choices, $query.clients, "id");

    let suggestions: ClientData[] = [];
    $: suggestions = available.slice((page - 1) * 10, page * 10);

    let pages: number;
    $: pages = Math.ceil(available.length / 10);

    async function updateChoices(filter: string, query: IQuery) {
        loading = true;
        choices = await getClients({
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

    function addClient(client: ClientData) {
        $query.clients = [...($query.clients ?? []), client];
    }

    function removeClient(client: ClientData) {
        $query.clients = $query.clients.filter(
            (_client) => _client.id !== client.id
        );
    }
</script>

<div class="select-clients">
    {#if $query.clients?.length}
        <div class="box">
            <div class="subtitle is-4">Selected host organizations</div>
            {#each $query.clients as client}
                <Client {client}>
                    <StarButton
                        slot="details-extra"
                        label="Remove from search"
                        on:click={() => removeClient(client)}
                        active={true}
                    />
                </Client>
            {/each}
        </div>
    {/if}
    <div class="box">
        <div class="subtitle is-4">Find host organizations</div>
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
                        title="search interests"
                    />
                </span>
            </p>
        </div>

        <div class="subtitle is-5">Matching host organizations</div>
        {#if suggestions?.length}
            <Paginator bind:page max_page={pages} />
            <div class="client-table">
                {#each suggestions as client}
                    <Client {client}>
                        <StarButton
                            slot="details-extra"
                            label="Add to search"
                            on:click={() => addClient(client)}
                        />
                    </Client>
                {/each}
            </div>
            <Paginator bind:page max_page={pages} />
        {:else if loading}
            <Loading label="host organizations" />
        {:else}
            <NoResults label="host organizations" />
        {/if}
    </div>
</div>

<style lang="less">
    .select-clients {
        display: flex;
        flex-flow: column;
    }
</style>
