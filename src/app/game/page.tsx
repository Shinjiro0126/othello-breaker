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

  // ゲーム開始時の処理（メッセージ表示後にCPUが一手目を打つ）
  useEffect(() => {
    if (gameState.gamePhase === 'starting') {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          gamePhase: 'playing'
        }));
      }, 2000); // 2秒後にゲーム開始
      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase, setGameState]);

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
          difficulty: gameState.difficulty || difficulty,
          playerWon: winner === 'W', // プレイヤー（白）が勝利したかどうか
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

  // CPU手番時の処理（CPUは黒）
  useEffect(() => {
    if (gameState.currentPlayer === 'B' && gameState.gamePhase === 'playing' && !gameState.isThinking) {
      generationRef.current++;
      const currentGen = generationRef.current;

      setGameState(prev => ({
        ...prev,
        isThinking: true,
        generationId: currentGen
      }));

      thinkAsync(gameState.board, 'B', currentGen).then(({ move, gen }) => {
        if (gen !== generationRef.current) {
          return;
        }

        setGameState(prevState => {
          if (prevState.currentPlayer !== 'B' || prevState.isThinking === false) {
            return prevState;
          }

          if (move === null) {
            const opponentMoves = OthelloGame.getValidMoves(prevState.board, 'W');
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
                currentPlayer: 'W',
                validMoves: opponentMoves,
                isThinking: false
              };
            }
          }

          const newBoard = OthelloGame.makeMove(prevState.board, move, 'B');
          if (!newBoard) return prevState;

          const newScores = OthelloGame.countPieces(newBoard);
          const humanMoves = OthelloGame.getValidMoves(newBoard, 'W');
          
          if (humanMoves.length === 0) {
            const cpuMoves = OthelloGame.getValidMoves(newBoard, 'B');
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
                currentPlayer: 'B',
                validMoves: [],
                isThinking: false
              };
            }
          }

          return {
            ...prevState,
            board: newBoard,
            currentPlayer: 'W',
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
        gameState.currentPlayer !== 'W' || 
        gameState.isThinking ||
        !gameState.validMoves.includes(index)) {
      return;
    }

    const newBoard = OthelloGame.makeMove(gameState.board, index, 'W');
    if (!newBoard) return;

    generationRef.current++;

    const newScores = OthelloGame.countPieces(newBoard);
    const cpuMoves = OthelloGame.getValidMoves(newBoard, 'B');
    
    if (cpuMoves.length === 0) {
      const humanMoves = OthelloGame.getValidMoves(newBoard, 'W');
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
      currentPlayer: 'B',
      scores: newScores,
      lastMove: index,
      validMoves: [],
      isThinking: false,
      generationId: generationRef.current
    }));
  }, [gameState, setGameState]);

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background.jpg')`,
        }}
      />
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* 浮遊する円形装飾 */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* ゲーム開始メッセージ */}
        {gameState.gamePhase === 'starting' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
            <div className="backdrop-blur-xl bg-white/20 p-12 rounded-3xl shadow-2xl border-2 border-white/30 animate-fade-in text-center">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">ゲーム開始！</h2>
              <p className="text-2xl text-white/90 mb-2 drop-shadow-lg">あなたは後攻（白）です</p>
              <p className="text-lg text-white/80 drop-shadow-md">CPUが先手を打ちます...</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">Othello Breaker</h1>
          <div className="inline-block backdrop-blur-md bg-white/20 px-6 py-2 rounded-full mb-4 border border-white/30">
            <span className="text-white/90 text-sm font-medium drop-shadow-lg">
              モード: {gameState.difficulty === 'beginner' ? 'ビギナー' : gameState.difficulty === 'normal' ? 'ノーマル' : gameState.difficulty === 'hard' ? 'ハード' : 'マスター'}
            </span>
          </div>
          <p className="text-lg text-white/90 drop-shadow-lg">
            CPUは1秒で最善手を狙う強敵です。でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="flex justify-center animate-slide-up w-full">
            <div className="w-full max-w-[600px]">
              <OthelloBoard gameState={gameState} onCellClick={handleCellClick} />
            </div>
          </div>
          
          <div className="space-y-6 animate-slide-up w-full" style={{animationDelay: '0.1s'}}>
            <ScoreBoard gameState={gameState} />

            <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <h3 className="font-semibold mb-3 text-white text-lg drop-shadow-lg">操作方法</h3>
              <ul className="text-sm text-white/90 space-y-2">
                <li>• 黄色のマーカーが表示された場所をクリックして駒を置けます</li>
                <li>• 赤い枠は直前に置かれた駒を示します</li>
                <li>• 白（あなた）が後手、黒（CPU）が先手です</li>
                <li>• 置ける場所がない場合は自動的にパスされます</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
