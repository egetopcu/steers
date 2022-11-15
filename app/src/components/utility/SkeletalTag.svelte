<script lang="ts">
    export let width = Math.random() * 8 + 3 + "em";
</script>

<div class="tag" style:width>&nbsp;</div>

<style lang="less">
    .tag {
        background-image: linear-gradient(
            110deg,
            transparent 8%,
            rgba(#fff, 0.5) 18%,
            transparent 33%
        );
        border-radius: 5px;
        background-size: 200%;
        animation: shimmer 2s linear infinite;
    }

    @keyframes shimmer {
        100% {
            background-position-x: -200%;
        }
    }
</style>
