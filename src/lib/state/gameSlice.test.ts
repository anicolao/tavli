import { describe, it, expect } from 'vitest';
import gameReducer, { moveChecker, rollDice } from './gameSlice';
import type { Player } from '../game/types';

describe('gameSlice', () => {
    it('should handle mother checker pin win for Player 1', () => {
        const initialState = gameReducer(undefined, { type: '@@INIT' });
        // Set up state where P2 has only mother checker left on Point 1 (index 0)
        // and P1 is about to move to Point 1.
        
        const state = {
            ...initialState,
            board: initialState.board.map(p => [...p]),
            movesRemaining: [1],
            turn: 1 as Player,
        };
        
        // P2 mother checker on point 1 (index 0)
        state.board[0] = [2]; 
        // P1 checker on point 2 (index 1)
        state.board[1] = [1];
        
        const nextState = gameReducer(state, moveChecker({ fromIndex: 1, toIndex: 0 }));
        
        expect(nextState.winner).toBe(1);
    });

    it('should handle mother checker pin win for Player 2', () => {
        const initialState = gameReducer(undefined, { type: '@@INIT' });
        
        const state = {
            ...initialState,
            board: initialState.board.map(p => [...p]),
            movesRemaining: [1],
            turn: 2 as Player,
        };
        
        // P1 mother checker on point 24 (index 23)
        state.board[23] = [1];
        // P2 checker on point 23 (index 22)
        state.board[22] = [2];
        
        const nextState = gameReducer(state, moveChecker({ fromIndex: 22, toIndex: 23 }));
        
        expect(nextState.winner).toBe(2);
    });
});
