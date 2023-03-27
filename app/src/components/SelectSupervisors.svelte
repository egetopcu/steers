<script lang="ts">
    import differenceBy from "lodash/differenceBy";
    import debounce from "lodash/debounce";

    import type { TutorData } from "@steers/common";
    import { getTutors } from "../utils/api";
    import { IQuery, query } from "../stores";

    import Supervisor from "./Supervisor.svelte";
    import Paginator from "./utility/Paginator.svelte";
    import StarButton from "./StarButton.svelte";

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

    function addTutor(tutor: TutorData) {
        $query.tutors = [...($query.tutors ?? []), tutor];
    }

    function removeTutor(tutor: TutorData) {
        $query.tutors = $query.tutors.filter(
            (_tutor) => _tutor.id !== tutor.id
        );
    }
</script>

<div class="select-supervisors">
    {#if $query.tutors?.length}
        {#each $query.tutors as supervisor}
            <Supervisor {supervisor}>
                <StarButton
                    slot="details-extra"
                    label="Remove from search"
                    on:click={() => removeTutor(supervisor)}
                    active={true}
                />
            </Supervisor>
        {/each}
    {/if}
    <input bind:value={filter} type="text" />
    <Paginator bind:page max_page={pages} />
    <div class="supervisor-table">
        {#each suggestions as supervisor}
            <Supervisor {supervisor}>
                <StarButton
                    slot="details-extra"
                    label="Add to search"
                    on:click={() => addTutor(supervisor)}
                />
            </Supervisor>
        {/each}
    </div>
    <Paginator bind:page max_page={pages} />
</div>

<style lang="less">
    .select-supervisors {
        display: flex;
        flex-flow: column;
    }
</style>
