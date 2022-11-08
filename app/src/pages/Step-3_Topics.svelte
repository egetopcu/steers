<script lang="ts">
    // TODO: maybe refactor topic list and topic tags into their own components (that would be proper, but it seems inane)

    import { query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import type { TopicData } from "@steers/common";
    import { getTopics } from "../utils/api";
    import SelectTopics from "../components/SelectTopics.svelte";

    const navigate = useNavigate();
    let topics: TopicData[] = [];
    let loading = false;

    //   guard against no interests being selected
    $: if ($query.categories.length <= 0) {
        navigate("/interests");
    }

    //   update available topics based on user selections
    $: updateTopics($query);

    const updateTopics = async (query) => {
        try {
            loading = true;
            topics = await getTopics("", query);
        } finally {
            loading = false;
        }
    };
</script>

<SelectTopics bind:selected={$query.topics} {topics} {loading} />
