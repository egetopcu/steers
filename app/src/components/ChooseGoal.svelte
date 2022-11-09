<script lang="ts">
    import { useNavigate } from "svelte-navigator";
    import { query, IQuery } from "../stores";
    import { view } from "../utils/view";

    const navigate = useNavigate();

    const setGoal = (goal: IQuery["goal"]) => {
        return () => {
            $query.goal = goal;
            navigate("/" + goal);
        };
    };

    const disabled = view(query, (query) =>
        query.categories?.length ? null : true
    );
</script>

<div class="choose-goal">
    <h2 class="title is-size-4 mt-6 mb-2">What are you looking for?</h2>
    <button
        on:click={setGoal("supervisor")}
        disabled={$disabled}
        class="button is-primary">Supervisor</button
    >
    <button
        on:click={setGoal("topic")}
        disabled={$disabled}
        class="button is-primary">Topic</button
    >
    <button
        on:click={setGoal("host")}
        disabled={$disabled}
        class="button is-primary">Internship</button
    >
</div>
