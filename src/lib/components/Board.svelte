<script lang="ts">
    import { store } from '../state/store';
    import { rollDice, moveChecker, bearOff, resetGame } from '../state/gameSlice';
    import { getLegalMoves, getLegalBearOffMoves } from '../game/logic';
    import Point from './Point.svelte';
    import Dice from './Dice.svelte';
    import GameInfo from './GameInfo.svelte';

    let gameState = $state(store.getState().game);
    store.subscribe(() => {
        gameState = store.getState().game;
    });

    let selectedPointIndex = $state<number | null>(null);
    let legalMoves = $derived(selectedPointIndex !== null ? getLegalMoves(gameState, selectedPointIndex) : []);
    let legalBearOffMoves = $derived(selectedPointIndex !== null ? getLegalBearOffMoves(gameState, selectedPointIndex) : []);

    function handleSelect(index: number) {
        if (gameState.winner) return;
        if (selectedPointIndex === index) {
            selectedPointIndex = null;
        } else {
            selectedPointIndex = index;
        }
    }

    function handleMoveTo(toIndex: number) {
        if (selectedPointIndex !== null) {
            store.dispatch(moveChecker({ fromIndex: selectedPointIndex, toIndex }));
            selectedPointIndex = null;
        }
    }

    function handleBearOff(dieValue: number) {
        if (selectedPointIndex !== null) {
            store.dispatch(bearOff({ fromIndex: selectedPointIndex, dieValue }));
            selectedPointIndex = null;
        }
    }

    // Split points into top and bottom rows for layout
    const bottomRow = $derived(gameState.board.slice(0, 12)); // 0-11
    const topRow = $derived(gameState.board.slice(12, 24).reverse()); // 23-12 (view from top)
</script>

<div class="game-container">
    <div class="sidebar">
        <GameInfo 
            turn={gameState.turn} 
            winner={gameState.winner} 
            checkersOff={gameState.checkersOff}
            onReset={() => store.dispatch(resetGame())}
        />
        <Dice 
            dice={gameState.dice} 
            movesRemaining={gameState.movesRemaining}
            onRoll={() => store.dispatch(rollDice())}
        />
        
        {#if legalBearOffMoves.length > 0}
            <div class="bear-off-actions">
                <h3>Bear Off</h3>
                {#each legalBearOffMoves as die}
                    <button onclick={() => handleBearOff(die)}>Use {die}</button>
                {/each}
            </div>
        {/if}
    </div>

    <div class="board">
        <div class="row top-row">
            {#each topRow as checkers, i}
                <Point 
                    index={23 - i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(23 - i)}
                    onSelect={handleSelect}
                    onMoveTo={handleMoveTo}
                />
            {/each}
        </div>
        
        <div class="bar-separator"></div>

        <div class="row bottom-row">
            {#each bottomRow as checkers, i}
                <Point 
                    index={i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(i)}
                    onSelect={handleSelect}
                    onMoveTo={handleMoveTo}
                />
            {/each}
        </div>
    </div>
</div>

<style>
    .game-container {
        display: flex;
        gap: 20px;
        padding: 20px;
        background-color: #333;
        color: white;
        height: 100vh;
        box-sizing: border-box;
        overflow: auto;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 250px;
    }

    .board {
        display: flex;
        flex-direction: column;
        background-color: #444;
        border: 10px solid #222;
        border-radius: 4px;
        flex-grow: 1;
        position: relative;
    }

    .row {
        display: flex;
        height: 50%;
    }

    .top-row {
        border-bottom: 2px solid #222;
    }

    .bar-separator {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 40px;
        background-color: #222;
        transform: translateX(-50%);
        z-index: 5;
    }

    .bear-off-actions {
        background-color: #444;
        padding: 10px;
        border-radius: 4px;
    }

    .bear-off-actions h3 {
        margin: 0 0 10px 0;
    }

    .bear-off-actions button {
        width: 100%;
        padding: 10px;
        margin-bottom: 5px;
        background-color: #ff9800;
        border: none;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
</style>
