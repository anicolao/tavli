<script lang="ts">
    import type { Player } from '../game/types';

    let { player }: { player: Player } = $props();
</script>

<div class="checker player-{player}" class:light={player === 1} class:dark={player === 2}>
</div>

<style>
    .checker {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: 2px solid #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: grab;
        transition: transform 0.1s;
    }

    .light {
        background-color: #f0f0f0;
        border-color: #ccc;
    }

    .dark {
        background-color: #333;
        border-color: #000;
    }

    .checker:active {
        cursor: grabbing;
        transform: scale(1.1);
    }
</style>
