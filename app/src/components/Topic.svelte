<script lang="ts">
import type { ITopic } from "../utils/types";


    export let topic: ITopic;
</script>

<style lang="less">
    .topic {
        padding: .3em;
        background-color: #f4f4f4;
        border-radius: .3em;
    }
</style>

<div class="topic">
    {topic.label}
</div>

