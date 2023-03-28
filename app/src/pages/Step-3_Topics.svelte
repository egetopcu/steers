<script lang="ts">
    import { query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import SelectTopics from "../components/SelectTopics.v2.svelte";

    const navigate = useNavigate();
    $: if (!$query.categories?.length) {
        navigate("/interests");
    }
</script>

<div class="select-topics">
    <SelectTopics />
</div>
