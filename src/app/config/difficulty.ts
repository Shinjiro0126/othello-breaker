import type { DifficultyLevel, DifficultyConfig } from '../types/game';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    maxDepth: 3,
    timeMs: 500,
    useIterativeDeepening: false,
    useEndgameSolver: false,
    endgameSolverThreshold: 0,
  },
  normal: {
    maxDepth: 7,
    timeMs: 800,
    useIterativeDeepening: false,
    useEndgameSolver: false,
    endgameSolverThreshold: 0,
  },
  hard: {
    maxDepth: 12,
    timeMs: 1000,
    useIterativeDeepening: true,
    useEndgameSolver: true,
    endgameSolverThreshold: 10,
  },
  master: {
    maxDepth: 15,
    timeMs: 1000,
    useIterativeDeepening: true,
    useEndgameSolver: true,
    endgameSolverThreshold: 14,
  },
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  normal: 'Normal',
  hard: 'Hard',
  master: 'Master',
};

export const DIFFICULTY_DESCRIPTIONS: Record<DifficultyLevel, string> = {
  beginner: '浅い読み + 角重視',
  normal: '標準（終盤完全読みなし）',
  hard: '強い（反復深化あり）',
  master: '最強（現行の強さ）',
};

export const DEFAULT_DIFFICULTY: DifficultyLevel = 'normal';
