'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../contexts/GameContext';
import OthelloBoard from '../components/OthelloBoard';
import ScoreBoard from '../components/ScoreBoard';
import { OthelloGame } from '../utils/othelloGame';
import { OthelloAI } from '../ai/othelloAI';
import type { Piece } from '../types/game';
import { saveGameResult } from '@/lib/firebase/firestore';
import { DIFFICULTY_CONFIGS } from '../config/difficulty';

export default function GamePage() {
  const { gameState, setGameState, refreshStats, difficulty } = useGameContext();
  const router = useRouter();
  const generationRef = useRef(0);
  const savedGameRef = useRef(false);

  // Get difficulty configuration
  const difficultyConfig = DIFFICULTY_CONFIGS[gameState.difficulty || difficulty];

  // ゲーム終了時の統計更新と結果ページへの遷移
  useEffect(() => {
    if (gameState.gamePhase === 'gameOver' && !savedGameRef.current) {
      savedGameRef.current = true;
      const winner = OthelloGame.getWinner(gameState.board);
      if (winner) {
        // Firestoreに保存
        const totalMoves = gameState.scores.black + gameState.scores.white - 4;
        saveGameResult({
          winner,
          blackScore: gameState.scores.black,
          whiteScore: gameState.scores.white,
          totalMoves,
        }).then(() => {
          // 保存成功後に統計を更新
          refreshStats();
        }).catch(error => {
          console.error('Failed to save game result to Firestore:', error);
        });

        // 結果ページへ遷移（少し遅延を入れる）
        setTimeout(() => {
          router.push('/result');
        }, 1500);
      }
    } else if (gameState.gamePhase === 'playing') {
      savedGameRef.current = false;
    }
  }, [gameState.gamePhase, gameState.scores.black, gameState.scores.white, router, refreshStats]);

  // AI思考処理（非同期）
  const thinkAsync = useCallback(async (board: Piece[], player: 'B' | 'W', gen: number) => {
    return new Promise<{ move: number | null; gen: number }>((resolve) => {
      setTimeout(() => {
        try {
          const validMoves = OthelloGame.getValidMoves(board, player);
          if (validMoves.length === 0) {
            resolve({ move: null, gen });
            return;
          }

          const bestMove = OthelloAI.findBestMove(
            board, 
            player, 
            difficultyConfig.timeMs,
            difficultyConfig.maxDepth,
            difficultyConfig.useIterativeDeepening,
            difficultyConfig.endgameSolverThreshold
          );
          
          if (bestMove !== null && validMoves.includes(bestMove)) {
            resolve({ move: bestMove, gen });
          } else {
            const cornerMoves = validMoves.filter(move => [0, 7, 56, 63].includes(move));
            const safeMove = cornerMoves.length > 0 ? cornerMoves[0] : validMoves[0];
            resolve({ move: safeMove, gen });
          }
        } catch (error) {
          console.error('AI error:', error);
          const moves = OthelloGame.getValidMoves(board, player);
          const safeMove = moves.length > 0 ? moves[0] : null;
          resolve({ move: safeMove, gen });
        }
      }, 100);
    });
  }, [difficultyConfig]);

  // CPU手番時の処理
  useEffect(() => {
    if (gameState.currentPlayer === 'W' && gameState.gamePhase === 'playing' && !gameState.isThinking) {
      generationRef.current++;
      const currentGen = generationRef.current;

      setGameState(prev => ({
        ...prev,
        isThinking: true,
        generationId: currentGen
      }));

      thinkAsync(gameState.board, 'W', currentGen).then(({ move, gen }) => {
        if (gen !== generationRef.current) {
          return;
        }

        setGameState(prevState => {
          if (prevState.currentPlayer !== 'W' || prevState.isThinking === false) {
            return prevState;
          }

          if (move === null) {
            const opponentMoves = OthelloGame.getValidMoves(prevState.board, 'B');
            if (opponentMoves.length === 0) {
              return {
                ...prevState,
                gamePhase: 'gameOver',
                isThinking: false,
                validMoves: []
              };
            } else {
              return {
                ...prevState,
                currentPlayer: 'B',
                validMoves: opponentMoves,
                isThinking: false
              };
            }
          }

          const newBoard = OthelloGame.makeMove(prevState.board, move, 'W');
          if (!newBoard) return prevState;

          const newScores = OthelloGame.countPieces(newBoard);
          const humanMoves = OthelloGame.getValidMoves(newBoard, 'B');
          
          if (humanMoves.length === 0) {
            const cpuMoves = OthelloGame.getValidMoves(newBoard, 'W');
            if (cpuMoves.length === 0) {
              return {
                ...prevState,
                board: newBoard,
                scores: newScores,
                lastMove: move,
                gamePhase: 'gameOver',
                isThinking: false,
                validMoves: []
              };
            } else {
              // CPUが連続手番（人間がパス）
              // 次のAI処理はuseEffectに任せて、現在の状態を更新するだけ
              return {
                ...prevState,
                board: newBoard,
                scores: newScores,
                lastMove: move,
                currentPlayer: 'W',
                validMoves: [],
                isThinking: false
              };
            }
          }

          return {
            ...prevState,
            board: newBoard,
            currentPlayer: 'B',
            scores: newScores,
            lastMove: move,
            validMoves: humanMoves,
            isThinking: false
          };
        });
      });
    }
  }, [gameState.currentPlayer, gameState.gamePhase, gameState.isThinking, thinkAsync, setGameState]);

  const handleCellClick = useCallback((index: number) => {
    if (gameState.gamePhase !== 'playing' || 
        gameState.currentPlayer !== 'B' || 
        gameState.isThinking ||
        !gameState.validMoves.includes(index)) {
      return;
    }

    const newBoard = OthelloGame.makeMove(gameState.board, index, 'B');
    if (!newBoard) return;

    generationRef.current++;

    const newScores = OthelloGame.countPieces(newBoard);
    const cpuMoves = OthelloGame.getValidMoves(newBoard, 'W');
    
    if (cpuMoves.length === 0) {
      const humanMoves = OthelloGame.getValidMoves(newBoard, 'B');
      if (humanMoves.length === 0) {
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          scores: newScores,
          lastMove: index,
          gamePhase: 'gameOver',
          validMoves: [],
          generationId: generationRef.current
        }));
        return;
      } else {
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          scores: newScores,
          lastMove: index,
          validMoves: humanMoves,
          generationId: generationRef.current
        }));
        return;
      }
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'W',
      scores: newScores,
      lastMove: index,
      validMoves: [],
      isThinking: false,
      generationId: generationRef.current
    }));
  }, [gameState, setGameState]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Othello Breaker</h1>
          <p className="text-lg text-gray-600">
            CPUは1秒で最善手を狙う強敵です。でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <OthelloBoard gameState={gameState} onCellClick={handleCellClick} />
          </div>
          
          <div className="space-y-6">
            <ScoreBoard gameState={gameState} />

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">操作方法</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 黄色のマーカーが表示された場所をクリックして駒を置けます</li>
                <li>• 赤い枠は直前に置かれた駒を示します</li>
                <li>• 黒（あなた）が先手、白（CPU）が後手です</li>
                <li>• 置ける場所がない場合は自動的にパスされます</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
