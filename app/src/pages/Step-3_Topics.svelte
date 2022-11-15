<script lang="ts">
    // TODO: maybe refactor topic list and topic tags into their own components (that would be proper, but it seems inane)

    import { IQuery, query } from "../stores";
    import { useNavigate } from "svelte-navigator";
    import type { TopicData } from "@steers/common";
    import { getTopics } from "../utils/api";
    import SelectTopics from "../components/SelectTopics.svelte";
    import debounce from "lodash/debounce";

    const navigate = useNavigate();
    let topics: TopicData[] = [];
    let loading = false;
    let filter = "";
    let filter_debounced = filter;

    //   guard against no interests being selected
    $: if (!$query.categories?.length) {
        navigate("/interests");
    }

    $: debounceFilter(filter);
    const debounceFilter = debounce(
        (filter) => {
            filter_debounced = filter;
        },
        500,
        { leading: false, trailing: true, maxWait: 3000 }
    );

    //   update available topics based on user selections
    $: updateTopics(filter_debounced, $query);
    const updateTopics = async (filter: string, query: IQuery) => {
        const query_data = {
            filter,
            required: {},
            optional: {
                // programme: query.programme?.id,
                categories: query.categories?.map((cat) => cat.id),
                topics: query.topics?.map((top) => top.id),
                tutors: query.tutors?.map((tut) => tut.id),
                clients: query.clients?.map((cli) => cli.id),
            },
            sort: "similarity DESC",
        };

        try {
            loading = true;
            topics = await getTopics(query_data);
        } finally {
            loading = false;
        }
    };
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
