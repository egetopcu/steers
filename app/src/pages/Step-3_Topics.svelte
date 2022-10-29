<script lang="ts">
  // TODO: refactor topic selection into separate component
  // TODO: maybe refactor topic list and topic tags into their own components (that would be proper, but it seems inane)

  import { IQuery, query } from "../stores";
  import { useNavigate } from "svelte-navigator";
  import type { TopicData } from "@steers/common";
  import { getTopics } from "../utils/api";
  import SelectTopics from "../components/SelectTopics.svelte";

  const navigate = useNavigate();
  let topics: TopicData[] = [];

  //   guard against no interests being selected
  $: if ($query.categories.length <= 0) {
    navigate("/interests");
  }

  //   update available topics based on user selections
  $: updateTopics($query);

  const updateTopics = async ({ programme, categories }: IQuery) => {
    topics = await getTopics("", programme, categories, [], []);
  };
</script>

<SelectTopics bind:selected={$query.topics} {topics} />
