<script lang="ts">
    import Select from "svelte-select";
    import { getTopics } from "../utils/api";
    import type { SelectChoices } from "../utils/types";

    export let programme: string;
    export let categories: string[];
    export let tutors: string[] = [];
    export let client: string = undefined;

    export let topics: string[] = undefined;
    export let choices: SelectChoices = undefined;

    $: {
        updateChoices(programme, categories, tutors, client);
    }

    async function updateChoices(programme, categories, tutors, client) {
        choices = await getTopics("", programme, categories, tutors, client);
    }
    function onSelect(ev) {
        topics = ev?.detail?.map((c) => c.value);
    }
</script>

<div class="field">
    <label for="topics">Do you have any topic(s) in mind?</label>
    <Select
        id="topics"
        items={choices}
        isMulti
        on:select={onSelect}
        loadOptions={(q) => getTopics(q, programme, categories, tutors, client)}
    />
</div>
