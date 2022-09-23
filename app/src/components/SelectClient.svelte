<script lang="ts">
    import Select from "svelte-select";
    import { getClients } from "../utils/api";

    export let programme: string;
    export let categories: string[];
    export let tutors: string[] = [];
    export let topics: string[] = [];

    export let client = undefined;
    export let choices = undefined;
    $: {
        updateChoices(programme, categories, tutors, topics);
    }
    async function updateChoices(programme, categories, tutors, topics) {
        choices = await getClients("", programme, categories, topics, tutors);
    }
    function onSelect(ev) {
        client = ev?.detail?.value;
    }
</script>

<div class="field">
    <label for="client">Do you have a host organization in mind?</label>
    <Select
        id="client"
        items={choices}
        loadOptions={(q) =>
            getClients(q, programme, categories, tutors, topics)}
        on:select={onSelect}
    />
</div>
