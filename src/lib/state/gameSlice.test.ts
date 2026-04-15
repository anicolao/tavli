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
        // P1 mother checker moved off home (point 24, index 23)
        state.board[23] = [];
        
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
        // P2 mother checker moved off home (point 1, index 0)
        state.board[0] = [];
        
        const nextState = gameReducer(state, moveChecker({ fromIndex: 22, toIndex: 23 }));
        
        expect(nextState.winner).toBe(2);
    });

    it('should NOT allow Player 2 to win if P2 also has mother checker at starting point', () => {
        const initialState = gameReducer(undefined, { type: '@@INIT' });
        const state = {
            ...initialState,
            board: initialState.board.map(p => [...p]),
            dice: [2],
            movesRemaining: [2],
            turn: 2 as Player,
        };
        state.board[23] = [1]; // P1 mother checker
        state.board[0] = [2, 2, 2]; // P2 still has mother checker at home
        state.board[21] = [2]; // P2 checker nearby
        
        const nextState = gameReducer(state, moveChecker({ fromIndex: 21, toIndex: 23 }));
        
        expect(nextState.board[23]).toEqual([1, 2]);
        expect(nextState.winner).toBe(null);
    });

    it('should allow Player 2 to win if they move their mother checker off home while pinning P1 mother checker', () => {
        const initialState = gameReducer(undefined, { type: '@@INIT' });
        const state = {
            ...initialState,
            board: initialState.board.map(p => [...p]),
            dice: [2],
            movesRemaining: [2],
            turn: 2 as Player,
        };
        state.board[23] = [1, 2]; // P1 mother pinned by P2
        state.board[0] = [2]; // P2 mother still at home
        
        // P2 moves their mother checker from 0 to 2
        const nextState = gameReducer(state, moveChecker({ fromIndex: 0, toIndex: 2 }));
        
        expect(nextState.board[0]).toEqual([]);
        expect(nextState.winner).toBe(2);
    });

    it('should handle draw when both mother checkers are pinned', () => {
        const initialState = gameReducer(undefined, { type: '@@INIT' });
        const state = {
            ...initialState,
            board: initialState.board.map(p => [...p]),
            movesRemaining: [1],
            turn: 1 as Player,
        };
        
        // P1 mother pinned by P2 at index 23
        state.board[23] = [1, 2];
        // P2 mother on point 1 (index 0)
        state.board[0] = [2];
        // P1 checker on point 2 (index 1)
        state.board[1] = [1];
        
        // P1 moves to index 0, pinning P2 mother
        const nextState = gameReducer(state, moveChecker({ fromIndex: 1, toIndex: 0 }));
        
        expect(nextState.board[0]).toEqual([2, 1]);
        expect(nextState.winner).toBe('draw');
    });
});
