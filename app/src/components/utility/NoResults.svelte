<script lang="ts">
    const no_results_images = [
        "images/no-results-01.png",
        "images/no-results-02.png",
        "images/no-results-03.png",
        "images/no-results-04.png",
        "images/no-results-05.png",
    ];
    const src =
        no_results_images[Math.floor(Math.random() * no_results_images.length)];
    export let label: string = "resources";
</script>

<div class="no-results">
    <img class="no-results-image" {src} alt={"no-results " + label} />
    <div class="no-results-label">
        Sorry, we couldn't find any {label}
    </div>
</div>

<style lang="less">
    .no-results {
        position: relative;
        width: 100%;
        height: 400px;
        max-height: 40vh;

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .no-results-image {
        filter: saturate(0) opacity(0.2);
        height: 100%;
        width: auto;
    }

    .no-results-label {
        position: absolute;
        top: 60%;
        width: max-content;
        font-size: 2em;
        padding: 0.2em;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 0.3em;
        box-shadow: 0 0 0.3em rgba(255, 255, 255, 0.2);
    }
</style>
