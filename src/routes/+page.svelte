<script lang="ts">
    import Board from '$lib/components/Board.svelte';
    import '../app.css';
</script>

<svelte:head>
    <title>Tavli - Plakoto MVP</title>
</svelte:head>

<main>
    <h1 class="sr-only">Tavli - Backgammon</h1>
    <Board />
</main>

<style>
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #1a1a1a;
    }
</style>
