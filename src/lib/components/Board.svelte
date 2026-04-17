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

    // Split points into quadrants for layout
    const topLeft = $derived(gameState.board.slice(18, 24).reverse()); // 23-18
    const topRight = $derived(gameState.board.slice(12, 18).reverse()); // 17-12
    const bottomLeft = $derived(gameState.board.slice(0, 6)); // 0-5
    const bottomRight = $derived(gameState.board.slice(6, 12)); // 6-11
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
        <div class="quadrant top-left">
            {#each topLeft as checkers, i}
                <Point 
                    index={23 - i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(23 - i)}
                    onSelect={handleSelect}
                    onMoveTo={handleMoveTo}
                />
            {/each}
        </div>
        
        <div class="bar"></div>

        <div class="quadrant top-right">
            {#each topRight as checkers, i}
                <Point 
                    index={17 - i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(17 - i)}
                    onSelect={handleSelect}
                    onMoveTo={handleMoveTo}
                />
            {/each}
        </div>

        <div class="quadrant bottom-left">
            {#each bottomLeft as checkers, i}
                <Point 
                    index={i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(i)}
                    onSelect={handleSelect}
                    onMoveTo={handleMoveTo}
                />
            {/each}
        </div>

        <div class="quadrant bottom-right">
            {#each bottomRight as checkers, i}
                <Point 
                    index={6 + i} 
                    {checkers} 
                    isHighlighted={legalMoves.includes(6 + i)}
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
        display: grid;
        grid-template-columns: 1fr 40px 1fr;
        grid-template-rows: 1fr 1fr;
        background-color: #444;
        border: 10px solid #222;
        border-radius: 4px;
        flex-grow: 1;
    }

    .quadrant {
        display: flex;
        height: 100%;
    }

    .top-left, .top-right {
        border-bottom: 1px solid #222;
    }

    .bottom-left, .bottom-right {
        align-items: flex-end;
    }

    .bar {
        background-color: #222;
        grid-row: 1 / span 2;
        grid-column: 2;
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
