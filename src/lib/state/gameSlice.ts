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
    
    // P1 loses if their last checker at index 23 is pinned by P2
    if (state.board[23].length >= 2 && state.board[23][0] === 1 && state.board[23][1] === 2) {
        // P1 mother checker pinned.
        // But wait, it only counts if it's the LAST one.
        // In Plakoto point array [1, 2], the 1 is pinned.
        // If there were [1, 1, 2], that's impossible in Plakoto because you can't pin a point with 2+ checkers.
        // So if board[23][0] is 1 and board[23][1] is 2, then the mother checker IS pinned.
        // We need to check if P1 still has their mother checker at point 24?
        // Actually, if they moved all other 14 checkers and the 15th one is pinned at home, they lose.
        
        // Let's refine Mother Checker Rule:
        // "If a player pins the opponent's mother checker on its starting point, they win."
        // We need to be careful if BOTH are pinned (draw), but for MVP let's keep it simple.
        state.winner = 2;
    }
    
    if (state.board[0].length >= 2 && state.board[0][0] === 2 && state.board[0][1] === 1) {
        state.winner = 1;
    }
}

export const { rollDice, moveChecker, bearOff, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
