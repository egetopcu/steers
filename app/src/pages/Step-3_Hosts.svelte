<script lang="ts">
    import { query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import SelectHosts from "../components/SelectHosts.svelte";

    const navigate = useNavigate();
    $: if (!$query.categories?.length) {
        navigate("/interests");
    }
</script>

<div class="select-hosts">
    <SelectHosts />
</div>
