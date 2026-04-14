# MVP Design: Tavli Digital Café

## System Architecture

The application follows a modern, reactive architecture centered around Event Sourcing.

1.  **Frontend (SvelteKit):** Handles routing, SSR, and the UI layer. It interacts with Firebase for authentication and real-time data sync.
2.  **State Management (Redux Toolkit):** Acts as the "source of truth" for the current UI and game state. It reduces the stream of events coming from Firestore to compute the current board position.
3.  **Persistence (Firestore):** Used as an append-only event log. Each match is a document, and every move is a document in an `events` sub-collection.

## Data Schema

### `users` (Collection)
- `uid`: string (Primary Key)
- `displayName`: string
- `photoURL`: string
- `stats`: { wins: number, losses: number, rating: number }
- `createdAt`: timestamp

### `matches` (Collection)
- `matchId`: string (Primary Key)
- `status`: 'waiting' | 'active' | 'completed'
- `variant`: 'portes' | 'plakoto' | 'fevga'
- `players`: { white: uid, black: uid }
- `config`: { pointLimit: number, timeControl: number }
- `currentTurn`: uid
- `winner`: uid | null
- `createdAt`: timestamp

### `matches/{matchId}/events` (Sub-collection)
Each document represents a discrete, immutable action.
- `id`: string
- `type`: 'MATCH_STARTED' | 'DICE_ROLLED' | 'CHECKER_MOVED' | 'DOUBLING_OFFERED' | 'MATCH_RESIGNED'
- `payload`: Object (varies by type, e.g., `{ dice: [3, 5] }` or `{ from: 24, to: 19 }`)
- `createdBy`: uid
- `timestamp`: serverTimestamp

## State Management Strategy

The Redux store will be composed of three primary slices:

1.  **`gameState`**:
    - Stores the derived current board state (checker positions, bar, home).
    - Stores the current dice and available moves.
    - Updated by a "reducer" that processes the stream of Firestore events in chronological order.
2.  **`uiState`**:
    - Manages local UI concerns: selected checker, drag-and-drop state, modals, and notifications.
3.  **`socialState`**:
    - Manages presence (online/offline), chat messages, and friend lists.

### Event Processing Flow
1. User performs an action (e.g., moves a checker).
2. Action is validated locally against the Redux `gameState`.
3. If valid, the action is written as a new document in the Firestore `events` sub-collection.
4. The Firestore listener detects the new event and dispatches it to the Redux store.
5. Redux reducers update the `gameState` based on the event.

## Phase 1 Deliverables (MVP)

1.  **Core Gameplay**: Implementation of the 'Portes' variant (standard backgammon).
2.  **Basic Matchmaking**: Ability to create a match and share a link, or join an open table.
3.  **Real-time Synchronization**: Using Firestore snapshots to ensure both players see the same state instantly.
4.  **Responsive UI**: A basic but polished "Café" themed interface optimized for mobile and desktop.
5.  **Authentication**: Simple Google/Email login via Firebase Auth.
