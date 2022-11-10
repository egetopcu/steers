<script lang="ts">
    // TODO: maybe refactor topic list and topic tags into their own components (that would be proper, but it seems inane)

    import { IQuery, query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import type { TopicData } from "@steers/common";
    import { getTopics } from "../utils/api";
    import SelectTopics from "../components/SelectTopics.svelte";
    import { view } from "../utils/view";
    import debounce from "lodash/debounce";

    const navigate = useNavigate();
    let topics: TopicData[] = [];
    let loading = false;
    let filter = "";

    //   guard against no interests being selected
    $: if (!$query.categories?.length) {
        navigate("/interests");
    }

    //   update available topics based on user selections
    $: updateTopics(filter, $query);

    const updateTopics = debounce(
        async (filter: string, query: IQuery) => {
            const query_data = {
                filter,
                required: {
                    programme: query.programme?.id,
                },
                optional: {
                    categories: query.categories?.map((cat) => cat.id),
                    topics: query.topics?.map((top) => top.id),
                    tutors: query.tutors?.map((tut) => tut.id),
                    clients: query.clients?.map((cli) => cli.id),
                },
            };

            try {
                loading = true;
                topics = await getTopics(query_data);
            } finally {
                loading = false;
            }
        },
        1000,
        { leading: false, trailing: true }
    );
</script>

<div class="field">
    <label for="topics-filter" class="label">Filter topics...</label>
    <input
        type="text"
        id="topics-filter"
        name="topics-filter"
        bind:value={filter}
    />
</div>
<SelectTopics bind:selected={$query.topics} {topics} {loading} />
