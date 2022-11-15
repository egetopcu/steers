<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { TutorData } from "@steers/common";
    import { getTutors } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Supervisor from "./Supervisor.svelte";
    import Paginator from "./utility/Paginator.svelte";

    let filter: string = "";
    let page = 1;
    let choices: TutorData[] = [];
    let available: TutorData[] = [];
    $: available = differenceBy(choices, $query.tutors, "id");

    let suggestions: TutorData[] = [];
    $: suggestions = available.slice((page - 1) * 10, page * 10);

    let pages: number;
    $: pages = Math.ceil(available.length / 10);

    async function updateChoices(filter: string, query: IQuery) {
        choices = await getTutors({
            filter,
            required: {},
            optional: {
                programme: query.programme?.id,
                categories: query.categories?.map((c) => c.id),
                topics: query.topics?.map((t) => t.id),
                tutors: query.tutors?.map((t) => t.id),
                clients: query.clients?.map((t) => t.id),
            },
        });
    }

    const debouncedUpdate = debounce(updateChoices, 1000, {
        maxWait: 5000,
        leading: false,
        trailing: true,
    });

    $: debouncedUpdate(filter, $query);
</script>

<div class="select-supervisors">
    {#if $query.tutors?.length}
        {#each $query.tutors as supervisor}
            <Supervisor {supervisor} />
        {/each}
    {/if}
    <input bind:value={filter} type="text" />
    <Paginator bind:page max_page={pages} />
    <div class="supervisor-table">
        {#each suggestions as supervisor}
            <Supervisor {supervisor} />
        {/each}
    </div>
</div>

<style lang="less">
    .select-supervisors {
        display: flex;
        flex-flow: column;
    }
</style>
