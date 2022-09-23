<script lang="ts">
    export let goal = undefined;
    export let enabled: boolean;
</script>

<div class="goal-container container">
    <label for="goal-choices">What are you looking for?</label>
    <div id="goal-choices" class="choices">
        <button
            class="choice"
            disabled={!enabled}
            on:click={() => (goal = "supervisor")}
        >
            Supervisor(s)
        </button>
        <button
            class="choice"
            disabled={!enabled}
            on:click={() => (goal = "topic")}
        >
            Topic
        </button>
        <button
            class="choice"
            disabled={!enabled}
            on:click={() => (goal = "client")}
        >
            Host organization
        </button>
    </div>
</div>

<style lang="less">
    .choices {
        display: flex;
        flex-flow: row nowrap;
        gap: 1em;
    }
    .choice {
        width: 100%;
        border-radius: 3px;
        padding: 1em;
    }
</style>
