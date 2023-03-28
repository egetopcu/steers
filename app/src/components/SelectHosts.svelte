<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { ClientData } from "@steers/common";
    import { getClients } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Paginator from "./utility/Paginator.svelte";
    import Client from "./Client.svelte";
    import StarButton from "./StarButton.svelte";

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
        choices = await getClients({
            filter,
            required: {
                programme: query.programme?.id,
                categories: query.categories?.map((c) => c.id),
            },
            optional: {
                topics: query.topics?.map((t) => t.id),
                tutors: query.tutors?.map((t) => t.id),
                clients: query.clients?.map((t) => t.id),
            },
            // sort: "similarity DESC",
        });
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
    {/if}
    <input bind:value={filter} type="text" />
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
</div>

<style lang="less">
    .select-clients {
        display: flex;
        flex-flow: column;
    }
</style>
