import { describe, it, expect } from 'vitest';
import { getLegalMoves, isBearOffLegal, getLegalBearOffMoves } from './logic';
import type { Player, GameState } from './types';

const createEmptyBoard = (): Player[][] => Array.from({ length: 24 }, () => []);

describe('Game Logic', () => {
    describe('getLegalMoves', () => {
        it('should return legal moves for Player 1', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [3, 4],
                movesRemaining: [3, 4],
                turn: 1,
                winner: null,
                checkersOff: { 1: 0, 2: 0 },
            };
            state.board[23] = [1, 1];
            
            const moves = getLegalMoves(state, 23);
            expect(moves).toContain(20); // 23 - 3
            expect(moves).toContain(19); // 23 - 4
        });

        it('should handle pinning for Player 2', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [2],
                movesRemaining: [2],
                turn: 2,
                winner: null,
                checkersOff: { 1: 0, 2: 0 },
            };
            state.board[5] = [2];
            state.board[7] = [1]; // Opponent checker
            
            const moves = getLegalMoves(state, 5);
            expect(moves).toContain(7); // Pinning is allowed
        });

        it('should block move if 2+ opponent checkers', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [2],
                movesRemaining: [2],
                turn: 2,
                winner: null,
                checkersOff: { 1: 0, 2: 0 },
            };
            state.board[5] = [2];
            state.board[7] = [1, 1]; // Blocked
            
            const moves = getLegalMoves(state, 5);
            expect(moves).not.toContain(7);
        });

        it('should allow landing on a point with a pinning checker', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [2],
                movesRemaining: [2],
                turn: 2,
                winner: null,
                checkersOff: { 1: 0, 2: 0 },
            };
            state.board[5] = [2];
            state.board[7] = [1, 2]; // Player 2 is already pinning Player 1
            
            const moves = getLegalMoves(state, 5);
            expect(moves).toContain(7);
        });
    });

    describe('isBearOffLegal', () => {
        it('should return true if all checkers are in home board', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [],
                movesRemaining: [],
                turn: 1,
                winner: null,
                checkersOff: { 1: 10, 2: 0 },
            };
            state.board[0] = [1, 1, 1, 1, 1];
            expect(isBearOffLegal(state, 1)).toBe(true);
        });

        it('should return false if some checkers are outside home board', () => {
            const state: GameState = {
                board: createEmptyBoard(),
                dice: [],
                movesRemaining: [],
                turn: 1,
                winner: null,
                checkersOff: { 1: 10, 2: 0 },
            };
            state.board[10] = [1]; // Outside home board (0-5)
            state.board[0] = [1, 1, 1, 1];
            expect(isBearOffLegal(state, 1)).toBe(false);
        });
    });
});
