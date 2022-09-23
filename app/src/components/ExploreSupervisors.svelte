<script lang="ts">
import Supervisor from "./Supervisor.svelte";

    export let programme;
    export let categories;
    export let client;
    export let topics;
    
    // todo: query supervisors from API
    let supervisors = [{ id: 123, name: "Karel Kroeze", department: "BDSi"}, {id: 321, name: "Anna Machens", department: "BDSi"}];
</script>

<div class="explore-supervisors">
    {#each supervisors as supervisor}
        <Supervisor label={supervisor.name} />
    {/each}
</div>