export type Player = 1 | 2; // 1: Light, 2: Dark

export interface GameState {
    board: Player[][]; // 24 points, each is an array of Players from bottom to top
    dice: number[];
    movesRemaining: number[];
    turn: Player;
    winner: Player | 'draw' | null;
    checkersOff: {
        1: number;
        2: number;
    };
}
