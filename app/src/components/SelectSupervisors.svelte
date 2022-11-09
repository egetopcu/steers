<script lang="ts">
    import { getTutors } from "../utils/api";
    import { IQuery, query } from "../stores";
    import differenceBy from "lodash/differenceBy";
    import type { TutorData } from "@steers/common";
    import Supervisor from "./Supervisor.svelte";
    import { debounce } from "lodash";

    let choices: TutorData[] = [];
    let filter: string = "";

    let suggestions: TutorData[] = [];
    $: suggestions = differenceBy(choices, $query.tutors, "id").slice(0, 10);

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
    <input bind:value={filter} type="text" />
    {#if $query.tutors?.length}
        {#each $query.tutors as supervisor}
            <Supervisor {supervisor} />
        {/each}
    {/if}
    {#each suggestions as supervisor}
        <Supervisor {supervisor} />
    {/each}
</div>

<style lang="less">
    .select-supervisors {
        display: flex;
        flex-flow: column;
    }
</style>
