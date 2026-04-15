# MVP Design: Tavli

## Objective
Deliver a functional Backgammon (Tavli) game that supports two-player local play on a single touchscreen table.

## Architecture
- **Framework**: SvelteKit (Svelte 5) for component-based UI.
- **State Management**: Redux Toolkit combined with Event Sourcing for robust game and UI state tracking.
- **Game Logic**: Custom implementation of Backgammon rules including board points, checker movement, and dice logic.
- **Rendering**: A responsive, touch-friendly board using HTML/CSS/SVG.
- **Persistence**: Local storage for game state recovery.
- **Hosting**: Static hosting on GitHub Pages with PR preview support.

## Component Breakdown
1. **Board**: The main grid container with 24 points.
2. **Point**: Individual triangle on the board, handling drop events.
3. **Checker**: Visual representation of a piece, handling drag events.
4. **Dice**: Logic and UI for rolling and displaying dice results.
5. **GameInfo**: UI showing current turn, score, and doubling cube status.

## MVP Features
- Full implementation of standard Backgammon rules.
- Local multiplayer support on a single device.
- Dice rolling and legal move highlighting.
- Win detection and game reset.
- Responsive design optimized for tabletop touchscreens.
