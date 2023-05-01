<script lang="ts">
    const loading_images = [
        "images/loading-02.png",
        "images/loading-03.png",
        "images/loading-04.png",
        "images/loading-05.png",
        "images/loading-06.png",
        "images/loading-07.png",
        "images/loading-08.png",
    ];
    const src =
        loading_images[Math.floor(Math.random() * loading_images.length)];
    export let label: string = "resources";

    let dots = "";
    setInterval(() => {
        dots = dots.trimEnd() + ".";

        if (dots.length > 3) {
            dots = "";
        }

        while (dots.length < 3) {
            dots += " ";
        }
    }, 300);
</script>

<div class="loading">
    <img class="loading-image" {src} alt={"loading " + label} />
    <div class="loading-label">
        Loading {label}<span class="dots">{dots}</span>
    </div>
</div>

<style lang="less">
    .loading {
        position: relative;
        width: 100%;
        height: 400px;
        max-height: 40vh;

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .loading-image {
        filter: saturate(0) opacity(0.2);
        height: 100%;
        width: auto;
    }

    .loading-label {
        position: absolute;
        top: 60%;
        width: max-content;
        font-size: 2em;
        padding: 0.2em;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 0.3em;
        box-shadow: 0 0 0.3em rgba(255, 255, 255, 0.2);

        .dots {
            white-space: pre;
            font-family: monospace;
            font-size: 1.5rem;
        }
    }
</style>
