<script lang="ts">
    import type { TopicData } from "@steers/common"

    export let topic: TopicData;
</script>

<style lang="less">
    .topic {
        padding: .3em;
        background-color: #f4f4f4;
        border-radius: .3em;
    }
</style>

<div class="topic">
    {topic.name}
</div>

