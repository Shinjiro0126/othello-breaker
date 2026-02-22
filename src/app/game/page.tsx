'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../contexts/GameContext';
import OthelloBoard from '../components/OthelloBoard';
import ScoreBoard from '../components/ScoreBoard';
import { OthelloGame } from '../utils/othelloGame';
import { OthelloAI } from '../ai/othelloAI';
import type { Piece } from '../types/game';
import { saveGameResult } from '@/lib/firebase/firestore';
import { DIFFICULTY_CONFIGS } from '../config/difficulty';
import Image from 'next/image';

export default function GamePage() {
  const { gameState, setGameState, refreshStats, difficulty, breakModeEnabled, breakUsed, setBreakUsed, isBreakSelecting, setIsBreakSelecting } = useGameContext();
  const router = useRouter();
  const generationRef = useRef(0);
  const savedGameRef = useRef(false);
  const [showBreakFlash, setShowBreakFlash] = useState(false);
  const [showBreakText, setShowBreakText] = useState(false);
  const [showBreakCpuResume, setShowBreakCpuResume] = useState(false);

  // Get difficulty configuration
  const difficultyConfig = DIFFICULTY_CONFIGS[gameState.difficulty || difficulty];

  // Compute remaining empty squares
  const remainingSquares = 64 - gameState.scores.black - gameState.scores.white;

  // Break available when: mode ON, not used, remaining ≤ 10, player's turn, game playing, not thinking, not already selecting
  const breakAvailable =
    breakModeEnabled &&
    !breakUsed &&
    remainingSquares <= 10 &&
    gameState.currentPlayer === 'W' &&
    gameState.gamePhase === 'playing' &&
    !gameState.isThinking &&
    !isBreakSelecting;

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

  // Break status message helper
  const getBreakStatusMessage = () => {
    if (breakUsed) return '使用済み';
    if (remainingSquares > 10) return `残り${remainingSquares}マス（残り10マス以下で使用可能）`;
    if (gameState.currentPlayer !== 'W') return '自分のターン中のみ使用可能';
    return '発動可能！';
  };

  // Break button click handler: enter break selection mode
  const handleBreakClick = useCallback(() => {
    if (!breakAvailable) return;
    setIsBreakSelecting(true);
  }, [breakAvailable, setIsBreakSelecting]);

  // Cancel break selection
  const handleBreakCancel = useCallback(() => {
    setIsBreakSelecting(false);
  }, [setIsBreakSelecting]);

  // Break piece selection handler
  const handleBreakSelect = useCallback((index: number) => {
    if (!isBreakSelecting) return;
    // Convert the selected black piece to white
    const newBoard = [...gameState.board];
    newBoard[index] = 'W';
    const newScores = OthelloGame.countPieces(newBoard);
    generationRef.current++;

    setBreakUsed(true);
    setIsBreakSelecting(false);

    // Show flash effect then break text, then CPU resume message
    setShowBreakFlash(true);
    setShowBreakText(true);

    const flashTimer = setTimeout(() => setShowBreakFlash(false), 300);

    const textTimer = setTimeout(() => {
      setShowBreakText(false);
      setShowBreakCpuResume(true);
    }, 1200);

    const resumeTimer = setTimeout(() => {
      setShowBreakCpuResume(false);
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
    }, 2700);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(textTimer);
      clearTimeout(resumeTimer);
    };
  }, [isBreakSelecting, gameState.board, setBreakUsed, setIsBreakSelecting, setGameState]);

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

      {/* Break flash overlay */}
      {showBreakFlash && (
        <div className="fixed inset-0 z-[100] bg-yellow-200/80 pointer-events-none animate-screen-flash" />
      )}

      {/* Break executed text */}
      {showBreakText && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
          <div className="text-4xl sm:text-6xl font-black text-yellow-300 drop-shadow-[0_0_30px_rgba(251,191,36,1)] animate-break-text text-center">
            ⚡ 盤面を破壊した！ ⚡
          </div>
        </div>
      )}

      {/* Break CPU resume message */}
      {showBreakCpuResume && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/20 p-8 rounded-3xl shadow-2xl border-2 border-yellow-400/40 animate-fade-in text-center max-w-sm mx-4">
            <div className="text-3xl mb-3">⚡</div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-2 drop-shadow-2xl">Break 発動！</h2>
            <p className="text-white/90 drop-shadow-lg">CPUのターンで再開します...</p>
          </div>
        </div>
      )}

      {/* Break selection modal overlay */}
      {/* (removed – selection now happens on the main board below) */}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* ゲーム開始メッセージ */}
        {gameState.gamePhase === 'starting' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">

            <div className="backdrop-blur-xl bg-white/20 p-6 sm:p-12 rounded-3xl shadow-2xl border-2 border-white/30 animate-fade-in text-center">
              <div className='flex justify-center mb-4'>
                <Image src="/men.png" alt="あなたを表す男の子のイラスト" width={100} height={100} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">ゲーム開始！</h2>
              <p className="text-2xl text-white/90 mb-2 drop-shadow-lg">あなたは後攻（白）です</p>
              <p className="text-lg text-white/80 drop-shadow-md">CPUが先手を打ちます...</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">Othello Breaker</h1>
          <div className="inline-flex gap-3 items-center backdrop-blur-md bg-white/20 px-6 py-2 rounded-full mb-4 border border-white/30">
            <span className="text-white/90 text-sm font-medium drop-shadow-lg">
              モード: {gameState.difficulty === 'beginner' ? 'ビギナー' : gameState.difficulty === 'normal' ? 'ノーマル' : gameState.difficulty === 'hard' ? 'ハード' : 'マスター'}
            </span>
            {breakModeEnabled && (
              <span className="text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full">⚡ Break Mode</span>
            )}
          </div>
          <p className="text-lg text-white/90 drop-shadow-lg">
            CPUは1秒で最善手を狙う強敵です。でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="flex justify-center animate-slide-up w-full">
            <div className="w-full max-w-[600px]">
              {/* Break selection instruction banner */}
              {isBreakSelecting && (
                <div className="mb-3 p-3 rounded-2xl border-2 border-yellow-400/60 bg-yellow-400/10 backdrop-blur-md animate-fade-in flex items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-yellow-300 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                      ⚡ BREAK MODE ⚡
                    </div>
                    <div className="text-white/80 text-xs mt-0.5">相手のコマを1つ選択せよ（角は選択不可）</div>
                  </div>
                  <button
                    onClick={handleBreakCancel}
                    className="shrink-0 px-4 py-1.5 rounded-xl border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all text-xs"
                  >
                    キャンセル
                  </button>
                </div>
              )}
              <OthelloBoard
                gameState={gameState}
                onCellClick={handleCellClick}
                isBreakSelecting={isBreakSelecting}
                onBreakSelect={handleBreakSelect}
              />
            </div>
          </div>
          
          <div className="space-y-6 animate-slide-up w-full" style={{animationDelay: '0.1s'}}>
            <ScoreBoard gameState={gameState} />

            {/* Break button (shown only when Break Mode is ON) */}
            {breakModeEnabled && (
              <div className="backdrop-blur-xl bg-white/10 p-4 rounded-3xl border border-white/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm drop-shadow-md">⚡ Break Mode</div>
                    <div className="text-xs text-white/60 mt-0.5">{getBreakStatusMessage()}</div>
                  </div>
                  <button
                    onClick={handleBreakClick}
                    disabled={!breakAvailable}
                    title={!breakAvailable ? '残り10マス以下で使用可能' : 'Breakを発動する'}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                      breakAvailable
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg shadow-yellow-400/40 hover:scale-105 animate-break-pulse cursor-pointer'
                        : 'bg-white/10 text-white/40 border border-white/20 cursor-not-allowed'
                    }`}
                  >
                    ⚡ Break
                  </button>
                </div>
              </div>
            )}

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
