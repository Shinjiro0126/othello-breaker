// ゲームの型定義
export type Piece = 'B' | 'W' | null;

export interface GameState {
  board: Piece[];
  currentPlayer: 'B' | 'W';
  gamePhase: 'playing' | 'gameOver';
  scores: {
    black: number;
    white: number;
  };
  lastMove: number | null;
  validMoves: number[];
  isThinking: boolean;
  generationId: number;
}

export interface AIWorkerMessage {
  type: 'think';
  board: Piece[];
  player: 'B' | 'W';
  timeMs: number;
  maxDepth?: number;
  gen: number;
}

export interface AIWorkerResponse {
  type: 'bestMove';
  move: number | null;
  gen: number;
}