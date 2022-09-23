<script lang="ts">
    import Select from "svelte-select";
    import { getTutors } from "../utils/api";

    export let programme: string;
    export let categories: string[];
    export let client: string = undefined;
    export let topics: string[] = [];

    export let tutors = [];
    export let choices = undefined;
</script>

<div class="field">
    <label for="tutors">Do you have supervisors in mind?</label>
    <Select
        id="tutors"
        bind:value={tutors}
        isMulti
        items={choices}
        loadOptions={(q) => getTutors(q, programme, categories, topics, client)}
    />
</div>
