<script lang="ts">
    import SelectCategories from "../components/SelectCategories.v2.svelte";
    import ChooseGoal from "../components/ChooseGoal.svelte";
    import SimilarCategories from "../components/SimilarCategories.svelte";

    import { query } from "../stores";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
    $: if (!$query.programme) {
        navigate("/");
    }
</script>

<div id="steers-step-1">
    <SelectCategories />
</div>
