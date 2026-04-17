import type { Player, GameState } from './types';

export const getLegalMoves = (state: GameState, fromIndex: number): number[] => {
    const { board, movesRemaining, turn } = state;
    
    if (movesRemaining.length === 0) return [];

    const point = board[fromIndex];
    if (point.length === 0) return [];
    
    // Top checker must be ours
    if (point[point.length - 1] !== turn) return [];
    
    // If it's a pinned point [Opponent, Us, ...], we can only move if we have 2+ checkers (i.e. we are on top)
    // Actually, if we have [Opponent, Us], we CAN move the 'Us' checker.
    // But we cannot move the 'Opponent' checker.
    // The rule is: the bottom-most checker is pinned.
    if (point[0] !== turn && point.length === 1) {
        // Should not happen if top checker is ours, but for safety:
        return [];
    }

    const direction = turn === 1 ? -1 : 1;
    const legalToIndices: number[] = [];
    const uniqueMoves = Array.from(new Set(movesRemaining));

    for (const move of uniqueMoves) {
        const toIndex = fromIndex + (move * direction);
        
        if (toIndex >= 0 && toIndex < 24) {
            const targetPoint = board[toIndex];
            if (targetPoint.length === 0) {
                // Empty point is always legal
                legalToIndices.push(toIndex);
            } else if (targetPoint[targetPoint.length - 1] === turn) {
                // Controlled by us (either our own point or we are pinning them)
                legalToIndices.push(toIndex);
            } else if (targetPoint.length === 1) {
                // Exactly one opponent checker - we can pin it
                legalToIndices.push(toIndex);
            }
            // else: 2+ opponent checkers OR they are pinning us -> blocked
        }
    }

    return legalToIndices;
};

export const isBearOffLegal = (state: GameState, player: Player): boolean => {
    const homeRange = player === 1 ? [0, 5] : [18, 23];
    let totalCheckersInHomeAndOff = state.checkersOff[player];
    
    for (let i = homeRange[0]; i <= homeRange[1]; i++) {
        totalCheckersInHomeAndOff += state.board[i].filter(p => p === player).length;
    }
    
    return totalCheckersInHomeAndOff === 15;
};

export const getLegalBearOffMoves = (state: GameState, fromIndex: number): number[] => {
    if (!isBearOffLegal(state, state.turn)) return [];
    
    const { board, movesRemaining, turn } = state;
    const point = board[fromIndex];
    if (point.length === 0 || point[point.length - 1] !== turn) return [];

    const direction = turn === 1 ? -1 : 1;
    const homeEnd = turn === 1 ? -1 : 24;
    
    const legalDice: number[] = [];
    const uniqueMoves = Array.from(new Set(movesRemaining));

    for (const move of uniqueMoves) {
        const toIndex = fromIndex + (move * direction);
        
        // Exact move to bear off
        if (toIndex === homeEnd) {
            legalDice.push(move);
        } else {
            // Move from further point if no checkers are behind it
            const isFurther = turn === 1 ? (toIndex < homeEnd) : (toIndex > homeEnd);
            if (isFurther) {
                const homeStart = turn === 1 ? 5 : 18;
                let checkersBehind = false;
                if (turn === 1) {
                    for (let i = 5; i > fromIndex; i--) {
                        if (board[i].some(p => p === turn)) {
                            checkersBehind = true;
                            break;
                        }
                    }
                } else {
                    for (let i = 18; i < fromIndex; i++) {
                        if (board[i].some(p => p === turn)) {
                            checkersBehind = true;
                            break;
                        }
                    }
                }
                
                if (!checkersBehind) {
                    legalDice.push(move);
                }
            }
        }
    }
    
    return Array.from(new Set(legalDice));
};

export const hasAnyLegalMoves = (state: GameState): boolean => {
    const { turn } = state;
    
    // Check all points on the board
    for (let i = 0; i < 24; i++) {
        if (getLegalMoves(state, i).length > 0) {
            return true;
        }
        if (getLegalBearOffMoves(state, i).length > 0) {
            return true;
        }
    }
    
    return false;
};
