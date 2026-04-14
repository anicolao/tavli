# Tavli Digital Café

Tavli Digital Café is a modern, Mediterranean-inspired backgammon platform focusing on social atmosphere, regional variants (Portes, Plakoto, Fevga), and a privacy-first, event-sourced architecture.

## Tech Stack

- **Frontend:** [SvelteKit](https://kit.svelte.dev/) (configured as a PWA)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Styling:** Vanilla CSS / CSS Modules
- **Testing:** [Playwright](https://playwright.dev/) for E2E testing

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anicolao/tavli.git
   cd tavli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   PUBLIC_FIREBASE_API_KEY=your_api_key
   PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Directory Structure

```text
.
├── src/
│   ├── lib/
│   │   ├── firebase/       # Firebase initialization and service wrappers
│   │   ├── components/     # Reusable Svelte components
│   │   ├── utils/          # Helper functions and business logic
│   │   └── types/          # TypeScript interfaces and types
│   ├── store/
│   │   ├── index.ts        # Redux store configuration
│   │   └── slices/         # Redux slices (gameState, uiState, etc.)
│   └── routes/             # SvelteKit pages and layouts
├── static/                 # Static assets (images, sounds, icons)
├── tests/
│   └── e2e/                # Playwright E2E scenarios
├── VISION.md               # Project vision and philosophy
├── MVP_DESIGN.md           # Technical architecture and roadmap
└── E2E_GUIDE.md            # E2E testing standards and philosophy
```
