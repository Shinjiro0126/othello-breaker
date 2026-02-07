'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GameState, DifficultyLevel } from '../types/game';
import { OthelloGame } from '../utils/othelloGame';
import { DEFAULT_DIFFICULTY } from '../config/difficulty';

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
      currentPlayer: 'B',
      gamePhase: 'playing',
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

  // Load stats from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('othello-stats');
      if (saved) {
        try {
          setStats(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse stats from localStorage:', error);
        }
      }
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('othello-stats', JSON.stringify(stats));
    }
  }, [stats]);

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
      currentPlayer: 'B',
      gamePhase: 'playing',
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
    <GameContext.Provider value={{ gameState, setGameState, stats, setStats, difficulty, setDifficulty, resetGame, startNewGame }}>
      {children}
    </GameContext.Provider>
  );
}
