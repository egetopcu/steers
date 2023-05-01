<script lang="ts">
    import { query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import SelectSupervisors from "../components/SelectSupervisors.svelte";

    const navigate = useNavigate();

    $: if (!$query.categories?.length) {
        navigate("/interests");
    }
</script>

<div class="under-construction">
    <SelectSupervisors />
</div>
