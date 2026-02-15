// ゲームの型定義
export type Piece = 'B' | 'W' | null;

export type DifficultyLevel = 'beginner' | 'normal' | 'hard' | 'master';

export interface DifficultyConfig {
  maxDepth: number;
  timeMs: number;
  useIterativeDeepening: boolean;
  useEndgameSolver: boolean;
  endgameSolverThreshold: number;
}

export interface GameState {
  board: Piece[];
  currentPlayer: 'B' | 'W';
  gamePhase: 'starting' | 'playing' | 'gameOver';
  scores: {
    black: number;
    white: number;
  };
  lastMove: number | null;
  validMoves: number[];
  isThinking: boolean;
  generationId: number;
  difficulty?: DifficultyLevel;
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