<script lang="ts">
    import { useNavigate } from "svelte-navigator";
    import { query, breadcrumbs } from "../stores";

    const navigate = useNavigate();

    //   back to step 1 if no programme was selected
    $: if (!$query.programme) {
        navigate("/");
    }

    const nextFunction = (path: string) => {
        return () => {
            $breadcrumbs = [
                ...$breadcrumbs,
                {
                    path: "/interests",
                    label: $query.categories.map((c) => c.name).join(", "),
                },
            ];

            navigate(path);
        };
    };
</script>

<div class="choose-goal">
    <h2 class="title is-size-4 mt-6 mb-2">What are you looking for?</h2>
    <button
        on:click={nextFunction("/supervisors")}
        disabled={$query.categories.length > 0 ? null : true}
        class="button is-primary">Supervisor</button
    >
    <button
        on:click={nextFunction("/topics")}
        disabled={$query.categories.length > 0 ? null : true}
        class="button is-primary">Topic</button
    >
    <button
        on:click={nextFunction("/host")}
        disabled={$query.categories.length > 0 ? null : true}
        class="button is-primary">Internship</button
    >
</div>
