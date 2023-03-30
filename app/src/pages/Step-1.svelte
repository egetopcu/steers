<script lang="ts">
    import { useNavigate } from "svelte-navigator";
    import SelectStudy from "../components/SelectStudy.svelte";
    import { query } from "../stores";
    import Loading from "../components/utility/Loading.svelte";

    const navigate = useNavigate();

    const onNext = () => {
        navigate("/interests");
    };
</script>

<div id="steers-step-1">
    <SelectStudy />
    <button
        on:click={onNext}
        disabled={!$query.programme ? true : null}
        class="button is-primary">Next</button
    >
</div>

<style lang="less">
    #steers-step-1 :global(.disabled) {
        cursor: not-allowed;
        pointer-events: none;
    }
</style>
