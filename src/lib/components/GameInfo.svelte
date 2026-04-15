<script lang="ts">
    import type { Player } from '../game/types';

    let { turn, winner, checkersOff, onReset }: { 
        turn: Player; 
        winner: Player | null;
        checkersOff: { 1: number; 2: number };
        onReset: () => void;
    } = $props();
</script>

<div class="game-info">
    <div class="status">
        {#if winner}
            <h2 class="winner">Player {winner === 1 ? 'Light' : 'Dark'} Wins!</h2>
            <button onclick={onReset}>Play Again</button>
        {:else}
            <h2>Turn: Player {turn === 1 ? 'Light' : 'Dark'}</h2>
        {/if}
    </div>

    <div class="score">
        <div>Light: {checkersOff[1]} / 15</div>
        <div>Dark: {checkersOff[2]} / 15</div>
    </div>
</div>

<style>
    .game-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #222;
        padding: 15px;
        border-radius: 8px;
        color: white;
        min-width: 200px;
    }

    .status h2 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }

    .winner {
        color: #ffeb3b;
    }

    .score {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
    }

    button {
        padding: 5px 15px;
        cursor: pointer;
    }
</style>
