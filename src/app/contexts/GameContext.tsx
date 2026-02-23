'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GameState, DifficultyLevel } from '../types/game';
import { OthelloGame } from '../utils/othelloGame';
import { DEFAULT_DIFFICULTY } from '../config/difficulty';
import { getAllGameResults, calculateStats, GameResult } from '@/lib/firebase/firestore';

const BREAK_MODE_STORAGE_KEY = 'othello-break-mode';

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
  // Break Mode
  breakModeEnabled: boolean;
  setBreakModeEnabled: (enabled: boolean) => void;
  breakUsed: boolean;
  setBreakUsed: React.Dispatch<React.SetStateAction<boolean>>;
  isBreakSelecting: boolean;
  setIsBreakSelecting: React.Dispatch<React.SetStateAction<boolean>>;
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
  // 初期値はDEFAULT_DIFFICULTYに固定してHydrationエラーを防ぐ
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(DEFAULT_DIFFICULTY);

  // クライアントサイドでマウント後にlocalStorageから読み込む
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('othello-difficulty');
      // データ検証：有効な難易度かどうかチェック
      if (saved && ['beginner', 'normal', 'hard', 'master'].includes(saved)) {
        setDifficultyState(saved as DifficultyLevel);
      }
    } catch (error) {
      console.error('Failed to load difficulty:', error);
    }
  }, []);

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
      difficulty: DEFAULT_DIFFICULTY
    };
  });

  // difficultyが変更されたらgameStateも更新
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      difficulty
    }));
  }, [difficulty]);

  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0
  });

  const [allResults, setAllResults] = useState<GameResult[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Break Mode state - 初期値はfalseに固定してHydrationエラーを防ぐ
  const [breakModeEnabled, setBreakModeEnabledState] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [breakUsed, setBreakUsed] = useState(false);
  const [isBreakSelecting, setIsBreakSelecting] = useState(false);

  // クライアントサイドでマウント後にローカルストレージから値を読み込む
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    
    try {
      const savedBreakMode = localStorage.getItem(BREAK_MODE_STORAGE_KEY);
      // データ検証：true/falseのみ受け入れる
      if (savedBreakMode === 'true' || savedBreakMode === 'false') {
        setBreakModeEnabledState(savedBreakMode === 'true');
      }
    } catch (error) {
      console.error('Failed to load break mode:', error);
    }
  }, []);

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

  const setBreakModeEnabled = (enabled: boolean) => {
    setBreakModeEnabledState(enabled);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BREAK_MODE_STORAGE_KEY, String(enabled));
      } catch (error) {
        console.error('Failed to save break mode:', error);
      }
    }
  };

  // Save difficulty to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('othello-difficulty', difficulty);
      } catch (error) {
        console.error('Failed to save difficulty:', error);
      }
    }
  }, [difficulty]);

  const setDifficulty = (newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty);
  };

  const resetGame = (newDifficulty?: DifficultyLevel) => {
    const useDifficulty = newDifficulty || difficulty;
    const initialBoard = OthelloGame.createInitialBoard();
    setBreakUsed(false);
    setIsBreakSelecting(false);
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
    <GameContext.Provider value={{ gameState, setGameState, stats, setStats, isLoadingStats, refreshStats, getStatsByDifficulty, allResults, difficulty, setDifficulty, resetGame, startNewGame, breakModeEnabled, setBreakModeEnabled, breakUsed, setBreakUsed, isBreakSelecting, setIsBreakSelecting }}>
      {children}
    </GameContext.Provider>
  );
}
