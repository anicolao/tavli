# Tavli

A modern, SvelteKit-powered Backgammon (Tavli) game designed for touchscreens and eventual network play.

## Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) with [SvelteKit](https://kit.svelte.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) via `svelte-redux`
- **Testing**: [Playwright](https://playwright.dev/) for E2E tests, [Vitest](https://vitest.dev/) for unit tests
- **Styling**: Vanilla CSS for maximum flexibility and performance

## Developing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Navigate to `http://localhost:5173` in your browser.

## Testing

- **Run all tests**: `npm test`
- **Run E2E tests**: `npm run test:e2e`
- **Run unit tests**: `npm run test:unit`

## Architecture

The project follows an event-sourced architecture for game state, ensuring deterministic behavior and easy debugging. For more details, see [MVP_DESIGN.md](./MVP_DESIGN.md) and [VISION.md](./VISION.md).
