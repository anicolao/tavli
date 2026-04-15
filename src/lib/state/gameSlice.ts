import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Player, GameState } from '../game/types';

const INITIAL_CHECKERS = 15;

const createInitialBoard = (): Player[][] => {
    const board: Player[][] = Array.from({ length: 24 }, () => []);
    // Player 2 (Dark) starts at Point 1 (index 0)
    board[0] = Array(INITIAL_CHECKERS).fill(2 as Player);
    // Player 1 (Light) starts at Point 24 (index 23)
    board[23] = Array(INITIAL_CHECKERS).fill(1 as Player);
    return board;
};

const initialState: GameState = {
    board: createInitialBoard(),
    dice: [],
    movesRemaining: [],
    turn: 1, // Light starts? Or should we roll for it? Let's say Light starts for MVP.
    winner: null,
    checkersOff: {
        1: 0,
        2: 0,
    },
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        rollDice: (state) => {
            if (state.movesRemaining.length > 0) return;
            
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            state.dice = [d1, d2];
            
            if (d1 === d2) {
                state.movesRemaining = [d1, d1, d1, d1];
            } else {
                state.movesRemaining = [d1, d2];
            }
        },
        moveChecker: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const { fromIndex, toIndex } = action.payload;
            const player = state.turn;
            
            // Logic for move validation should probably be here or in a separate helper
            // For now, let's assume UI only sends valid moves
            
            const distance = Math.abs(fromIndex - toIndex);
            const moveIndex = state.movesRemaining.indexOf(distance);
            
            if (moveIndex === -1) return; // Invalid move distance
            
            // Execute move
            const checker = state.board[fromIndex].pop();
            if (!checker) return;
            
            state.board[toIndex].push(checker);
            state.movesRemaining.splice(moveIndex, 1);
            
            // Check win conditions
            checkWinner(state);
            
            // Change turn if no moves left
            if (state.movesRemaining.length === 0) {
                state.turn = state.turn === 1 ? 2 : 1;
                state.dice = [];
            }
        },
        bearOff: (state, action: PayloadAction<{ fromIndex: number; dieValue: number }>) => {
            const { fromIndex, dieValue } = action.payload;
            const player = state.turn;
            
            const moveIndex = state.movesRemaining.indexOf(dieValue);
            if (moveIndex === -1) return;
            
            const checker = state.board[fromIndex].pop();
            if (checker) {
                state.checkersOff[player]++;
                state.movesRemaining.splice(moveIndex, 1);
            }
            
            checkWinner(state);
            
            if (state.movesRemaining.length === 0) {
                state.turn = state.turn === 1 ? 2 : 1;
                state.dice = [];
            }
        },
        resetGame: (state) => {
            Object.assign(state, initialState);
            state.board = createInitialBoard();
        }
    },
});

function checkWinner(state: GameState) {
    // 1. All checkers borne off
    if (state.checkersOff[1] === INITIAL_CHECKERS) {
        state.winner = 1;
        return;
    }
    if (state.checkersOff[2] === INITIAL_CHECKERS) {
        state.winner = 2;
        return;
    }
    
    // 2. Mother checker pinned
    // P1 mother checker is at index 23
    // P2 mother checker is at index 0
    
    // P1 mother checker is pinned if the bottom checker is 1 and there is a 2 on top of it.
    const p1MotherPinned = state.board[23].length >= 2 && state.board[23][0] === 1 && state.board[23][1] === 2;
    // P2 mother checker is pinned if the bottom checker is 2 and there is a 1 on top of it.
    const p2MotherPinned = state.board[0].length >= 2 && state.board[0][0] === 2 && state.board[0][1] === 1;

    // A player still has their mother checker at home if any of their checkers are at their starting point.
    // In Plakoto, all 15 start there, so if the point has any of your checkers, the mother checker (the last one) is still there.
    const p1MotherAtHome = state.board[23].some(p => p === 1);
    const p2MotherAtHome = state.board[0].some(p => p === 2);

    if (p1MotherPinned && !p2MotherAtHome) {
        state.winner = 2;
    } else if (p2MotherPinned && !p1MotherAtHome) {
        state.winner = 1;
    }
}

export const { rollDice, moveChecker, bearOff, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
