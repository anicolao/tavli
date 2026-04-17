import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
});

if (typeof window !== 'undefined') {
    (window as any).store = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
