<script lang="ts">
    import type { Player } from '../game/types';
    import Checker from './Checker.svelte';

    let { 
        index, 
        checkers, 
        isHighlighted = false, 
        onSelect,
        onMoveTo
    }: { 
        index: number; 
        checkers: Player[]; 
        isHighlighted?: boolean;
        onSelect?: (index: number) => void;
        onMoveTo?: (index: number) => void;
    } = $props();

    const isTopPoint = index >= 12; // 12-23 are top
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="point" 
    class:highlight={isHighlighted} 
    class:top={isTopPoint}
    class:bottom={!isTopPoint}
    onclick={() => isHighlighted ? onMoveTo?.(index) : onSelect?.(index)}
>
    <div class="checker-container" class:reverse={isTopPoint}>
        {#each checkers as player, i}
            <div class="checker-wrapper" style="--offset: {i * 5}px">
                <Checker {player} />
            </div>
        {/each}
    </div>
</div>

<style>
    .point {
        width: 60px;
        height: 250px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
    }

    .point::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
    }

    .top::before {
        top: 0;
        border-top: 200px solid #555;
    }

    .bottom::before {
        bottom: 0;
        border-bottom: 200px solid #555;
    }

    .point:nth-child(even)::before {
        border-top-color: #777;
        border-bottom-color: #777;
    }

    .highlight::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 0, 0.2);
        z-index: 10;
    }

    .checker-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 5px 0;
    }

    .bottom .checker-container {
        justify-content: flex-end;
    }

    .top .checker-container {
        justify-content: flex-start;
    }

    .checker-wrapper {
        position: absolute;
    }

    .bottom .checker-wrapper {
        bottom: var(--offset);
    }

    .top .checker-wrapper {
        top: var(--offset);
    }
</style>
