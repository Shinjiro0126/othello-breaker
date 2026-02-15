'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GameState, DifficultyLevel } from '../types/game';
import { OthelloGame } from '../utils/othelloGame';
import { DEFAULT_DIFFICULTY } from '../config/difficulty';
import { getAllGameResults, calculateStats, GameResult } from '@/lib/firebase/firestore';

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  stats: GameStats;
  setStats: React.Dispatch<React.SetStateAction<GameStats>>;
  isLoadingStats: boolean;
  refreshStats: (difficulty?: DifficultyLevel) => Promise<void>;
  getStatsByDifficulty: (difficulty?: DifficultyLevel) => GameStats;
  allResults: GameResult[]; // 全結果を保持
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  resetGame: () => void;
  startNewGame: (difficulty?: DifficultyLevel) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('othello-difficulty');
      if (saved && ['beginner', 'normal', 'hard', 'master'].includes(saved)) {
        return saved as DifficultyLevel;
      }
    }
    return DEFAULT_DIFFICULTY;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = OthelloGame.createInitialBoard();
    return {
      board: initialBoard,
      currentPlayer: 'B', // CPUが先攻（黒）
      gamePhase: 'starting', // 開始メッセージ表示用
      scores: OthelloGame.countPieces(initialBoard),
      lastMove: null,
      validMoves: OthelloGame.getValidMoves(initialBoard, 'B'),
      isThinking: false,
      generationId: 0,
      difficulty
    };
  });

  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0
  });

  const [allResults, setAllResults] = useState<GameResult[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Firestoreから統計を取得
  const refreshStats = async (filterDifficulty?: DifficultyLevel) => {
    setIsLoadingStats(true);
    try {
      const results = await getAllGameResults();
      setAllResults(results); // 全結果を保存
      const calculated = calculateStats(results, filterDifficulty);
      setStats(calculated);
    } catch (error) {
      console.error('Failed to fetch stats from Firestore:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // 難易度別の統計を取得
  const getStatsByDifficulty = (filterDifficulty?: DifficultyLevel): GameStats => {
    return calculateStats(allResults, filterDifficulty);
  };

  // 初回マウント時に統計を取得
  useEffect(() => {
    refreshStats();
  }, []);

  // Save difficulty to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('othello-difficulty', difficulty);
    }
  }, [difficulty]);

  const setDifficulty = (newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty);
  };

  const resetGame = (newDifficulty?: DifficultyLevel) => {
    const useDifficulty = newDifficulty || difficulty;
    const initialBoard = OthelloGame.createInitialBoard();
    setGameState({
      board: initialBoard,
      currentPlayer: 'B', // CPUが先攻（黒）
      gamePhase: 'starting', // 開始メッセージ表示用
      scores: OthelloGame.countPieces(initialBoard),
      lastMove: null,
      validMoves: OthelloGame.getValidMoves(initialBoard, 'B'),
      isThinking: false,
      generationId: Date.now(),
      difficulty: useDifficulty
    });
  };

  const startNewGame = (newDifficulty?: DifficultyLevel) => {
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    resetGame(newDifficulty);
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState, stats, setStats, isLoadingStats, refreshStats, getStatsByDifficulty, allResults, difficulty, setDifficulty, resetGame, startNewGame }}>
      {children}
    </GameContext.Provider>
  );
}
