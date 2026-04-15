<script lang="ts">
    let { dice, movesRemaining, onRoll }: { 
        dice: number[]; 
        movesRemaining: number[]; 
        onRoll: () => void;
    } = $props();
</script>

<div class="dice-container">
    {#if dice.length === 0}
        <button onclick={onRoll}>Roll Dice</button>
    {:else}
        <div class="dice">
            {#each dice as die}
                <div class="die">{die}</div>
            {/each}
        </div>
        <div class="moves">
            Moves left: {movesRemaining.join(', ')}
        </div>
    {/if}
</div>

<style>
    .dice-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        min-width: 150px;
    }

    .dice {
        display: flex;
        gap: 10px;
    }

    .die {
        width: 40px;
        height: 40px;
        background-color: white;
        color: black;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .moves {
        font-size: 0.9rem;
        color: #ddd;
    }

    button {
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
