'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OthelloGame } from '../utils/othelloGame';
import { OthelloAI } from '../ai/othelloAI';
import type { GameState, Piece } from '../types/game';
import { saveGameResult } from '../../../lib/gameResults';

const CELL_SIZE = 'w-12 h-12 sm:w-16 sm:h-16';
const PIECE_SIZE = 'w-8 h-8 sm:w-12 sm:h-12';

interface OthelloBoardProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
}

const OthelloBoard: React.FC<OthelloBoardProps> = ({ gameState, onCellClick }) => {
  const renderCell = (piece: Piece, index: number) => {
    const isValidMove = gameState.validMoves.includes(index);
    const isLastMove = gameState.lastMove === index;

    return (
      <div
        key={index}
        className={`
          ${CELL_SIZE} border border-green-600 bg-green-500 flex items-center justify-center
          cursor-pointer hover:bg-green-400 transition-colors relative
          ${isValidMove ? 'ring-2 ring-yellow-400 ring-inset' : ''}
          ${isLastMove ? 'ring-2 ring-red-400 ring-inset' : ''}
        `}
        onClick={() => onCellClick(index)}
      >
        {piece && (
          <div
            className={`
              ${PIECE_SIZE} rounded-full border-2 border-gray-300 transition-all duration-300
              ${piece === 'B' ? 'bg-black' : 'bg-white'}
              ${isLastMove ? 'ring-2 ring-red-400' : ''}
            `}
          />
        )}
        {isValidMove && !piece && (
          <div className={`${PIECE_SIZE} rounded-full bg-yellow-300 opacity-50`} />
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-8 gap-1 p-4 bg-green-700 rounded-lg shadow-lg">
      {gameState.board.map((piece, index) => renderCell(piece, index))}
    </div>
  );
};

interface ScoreBoardProps {
  gameState: GameState;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const winner = OthelloGame.getWinner(gameState.board);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">スコア</h2>
      
      <div className="space-y-3 mb-6">
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
          gameState.currentPlayer === 'B' 
            ? 'bg-gray-800 border-gray-900 shadow-md' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full border-2 border-gray-400 shadow-sm"></div>
            <span className={`font-bold text-lg ${
              gameState.currentPlayer === 'B' ? 'text-white' : 'text-gray-800'
            }`}>
              あなた (黒)
            </span>
          </div>
          <span className={`font-bold text-2xl ${
            gameState.currentPlayer === 'B' ? 'text-white' : 'text-gray-800'
          }`}>
            {gameState.scores.black}
          </span>
        </div>
        
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
          gameState.currentPlayer === 'W' 
            ? 'bg-blue-600 border-blue-700 shadow-md' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-400 shadow-sm"></div>
            <span className={`font-bold text-lg ${
              gameState.currentPlayer === 'W' ? 'text-white' : 'text-gray-800'
            }`}>
              CPU (白)
            </span>
          </div>
          <span className={`font-bold text-2xl ${
            gameState.currentPlayer === 'W' ? 'text-white' : 'text-gray-800'
          }`}>
            {gameState.scores.white}
          </span>
        </div>
      </div>

      {gameState.isThinking && (
        <div className="text-center p-3 bg-blue-100 rounded mb-4">
          <div className="animate-pulse text-blue-800 font-medium">
            Thinking…（最善手を検討中）
          </div>
        </div>
      )}

      {gameState.gamePhase === 'playing' && !gameState.isThinking && (
        <div className="text-center p-3 bg-gray-100 rounded mb-4">
          <span className="font-medium">
            {gameState.currentPlayer === 'B' ? 'あなたの番です' : 'CPUの番です'}
          </span>
        </div>
      )}

      {gameState.gamePhase === 'gameOver' && (
        <div className="text-center p-4 bg-yellow-100 rounded">
          <h3 className="text-xl font-bold mb-2">ゲーム終了！</h3>
          <p className="mb-2">
            {winner === 'B' && '🎉 あなたの勝利です！'}
            {winner === 'W' && '😤 CPUの勝利です'}
            {winner === 'tie' && '🤝 引き分けです'}
          </p>
          <p className="text-sm text-gray-600">
            CPUは強力ですが、時間制限により完璧ではありません。次の対局でもう一手先を。
          </p>
        </div>
      )}
    </div>
  );
};

const OthelloGameComponent: React.FC = () => {
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
      moveCount: 0
    };
  });

  const generationRef = useRef(0);
  const savedGameRef = useRef(false);

  // Save game result when game is over
  useEffect(() => {
    if (gameState.gamePhase === 'gameOver' && !savedGameRef.current) {
      const winner = OthelloGame.getWinner(gameState.board);
      if (winner !== null) {
        savedGameRef.current = true;
        saveGameResult({
          timestamp: new Date(),
          winner,
          blackScore: gameState.scores.black,
          whiteScore: gameState.scores.white,
          moves: gameState.moveCount,
        }).catch((error) => {
          console.error('Failed to save game result:', error);
          if (typeof window !== 'undefined') {
            window.alert(
              'Your game result could not be saved due to a server or network error. ' +
              'Please check your connection and try again later.'
            );
          }
        });
      }
    } else if (gameState.gamePhase === 'playing') {
      // Reset the flag when a new game starts
      savedGameRef.current = false;
    }
    // Depend on the full gameState so that winner, scores, and moveCount are always up to date.
  }, [gameState]);

  // AI思考処理（非同期）
  const thinkAsync = useCallback(async (board: Piece[], player: 'B' | 'W', gen: number) => {
    return new Promise<{ move: number | null; gen: number }>((resolve) => {
      // UIブロックを避けるため少し遅延
      setTimeout(() => {
        try {
          // まず合法手を取得
          const validMoves = OthelloGame.getValidMoves(board, player);
          if (validMoves.length === 0) {
            resolve({ move: null, gen });
            return;
          }

          // AI思考実行
          const bestMove = OthelloAI.findBestMove(board, player, 1000);
          
          // 結果が合法手かチェック
          if (bestMove !== null && validMoves.includes(bestMove)) {
            resolve({ move: bestMove, gen });
          } else {
            // フォールバック: 角優先、なければ最初の合法手
            const cornerMoves = validMoves.filter(move => [0, 7, 56, 63].includes(move));
            const safeMove = cornerMoves.length > 0 ? cornerMoves[0] : validMoves[0];
            resolve({ move: safeMove, gen });
          }
        } catch (error) {
          console.error('AI error:', error);
          // エラー時は安全な手を返す
          const moves = OthelloGame.getValidMoves(board, player);
          const safeMove = moves.length > 0 ? moves[0] : null;
          resolve({ move: safeMove, gen });
        }
      }, 100);
    });
  }, []);

  // CPU手番時の処理
  useEffect(() => {
    if (gameState.currentPlayer === 'W' && gameState.gamePhase === 'playing' && !gameState.isThinking) {
      // AI思考開始
      generationRef.current++;
      const currentGen = generationRef.current;

      setGameState(prev => ({
        ...prev,
        isThinking: true,
        generationId: currentGen
      }));

      // 非同期でAI思考実行
      thinkAsync(gameState.board, 'W', currentGen).then(({ move, gen }) => {
        // 世代IDが一致しない場合は破棄
        if (gen !== generationRef.current) {
          console.log('Discarding outdated AI response', { gen, current: generationRef.current });
          return;
        }

        setGameState(prevState => {
          if (prevState.currentPlayer !== 'W' || prevState.isThinking === false) {
            return prevState;
          }

          if (move === null) {
            // CPUパス
            const opponentMoves = OthelloGame.getValidMoves(prevState.board, 'B');
            if (opponentMoves.length === 0) {
              // ゲーム終了
              return {
                ...prevState,
                gamePhase: 'gameOver',
                isThinking: false,
                validMoves: []
              };
            } else {
              // 人間の手番に戻る
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
              // ゲーム終了
              return {
                ...prevState,
                board: newBoard,
                scores: newScores,
                lastMove: move,
                gamePhase: 'gameOver',
                isThinking: false,
                validMoves: [],
                moveCount: prevState.moveCount + 1
              };
            } else {
              // CPUが連続手番 - 再帰的に処理
              setTimeout(() => {
                generationRef.current++;
                const nextGen = generationRef.current;
                setGameState(currentState => ({
                  ...currentState,
                  board: newBoard,
                  scores: newScores,
                  lastMove: move,
                  validMoves: [],
                  isThinking: true,
                  generationId: nextGen,
                  moveCount: currentState.moveCount + 1
                }));

                thinkAsync(newBoard, 'W', nextGen).then(nextResult => {
                  // 同様の処理を実行（簡略化のため、この場合は人間手番に移る）
                  if (nextResult.gen === generationRef.current) {
                    const nextBoard = nextResult.move ? OthelloGame.makeMove(newBoard, nextResult.move, 'W') : newBoard;
                    if (nextBoard) {
                      const nextScores = OthelloGame.countPieces(nextBoard);
                      const nextHumanMoves = OthelloGame.getValidMoves(nextBoard, 'B');
                      
                      setGameState(state => ({
                        ...state,
                        board: nextBoard,
                        currentPlayer: 'B',
                        scores: nextScores,
                        lastMove: nextResult.move,
                        validMoves: nextHumanMoves,
                        isThinking: false,
                        moveCount: state.moveCount + 1
                      }));
                    }
                  }
                });
              }, 500);

              return {
                ...prevState,
                board: newBoard,
                scores: newScores,
                lastMove: move,
                validMoves: [],
                isThinking: true,
                generationId: generationRef.current
              };
            }
          }

          // 人間の手番
          return {
            ...prevState,
            board: newBoard,
            currentPlayer: 'B',
            scores: newScores,
            lastMove: move,
            validMoves: humanMoves,
            isThinking: false,
            moveCount: prevState.moveCount + 1
          };
        });
      });
    }
    // Note: gameState.board is intentionally not in dependencies to avoid infinite loops
    // The board value is captured at the moment when currentPlayer/gamePhase/isThinking changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentPlayer, gameState.gamePhase, gameState.isThinking, thinkAsync]);

  const handleCellClick = useCallback((index: number) => {
    if (gameState.gamePhase !== 'playing' || 
        gameState.currentPlayer !== 'B' || 
        gameState.isThinking ||
        !gameState.validMoves.includes(index)) {
      return;
    }

    const newBoard = OthelloGame.makeMove(gameState.board, index, 'B');
    if (!newBoard) return;

    // 世代IDを更新（AI思考をキャンセル）
    generationRef.current++;

    const newScores = OthelloGame.countPieces(newBoard);
    const cpuMoves = OthelloGame.getValidMoves(newBoard, 'W');
    
    if (cpuMoves.length === 0) {
      const humanMoves = OthelloGame.getValidMoves(newBoard, 'B');
      if (humanMoves.length === 0) {
        // ゲーム終了
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          scores: newScores,
          lastMove: index,
          gamePhase: 'gameOver',
          validMoves: [],
          generationId: generationRef.current,
          moveCount: prev.moveCount + 1
        }));
        return;
      } else {
        // 人間が連続
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          scores: newScores,
          lastMove: index,
          validMoves: humanMoves,
          generationId: generationRef.current,
          moveCount: prev.moveCount + 1
        }));
        return;
      }
    }

    // CPUの手番
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'W',
      scores: newScores,
      lastMove: index,
      validMoves: [],
      isThinking: false,
      generationId: generationRef.current,
      moveCount: prev.moveCount + 1
    }));
  }, [gameState]);

  const resetGame = useCallback(() => {
    generationRef.current++;
    const initialBoard = OthelloGame.createInitialBoard();
    setGameState({
      board: initialBoard,
      currentPlayer: 'B',
      gamePhase: 'playing',
      scores: OthelloGame.countPieces(initialBoard),
      lastMove: null,
      validMoves: OthelloGame.getValidMoves(initialBoard, 'B'),
      isThinking: false,
      generationId: generationRef.current,
      moveCount: 0
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Othello Breaker</h1>
          <p className="text-lg text-gray-600 mb-4">
            CPUは1秒で最善手を狙う強敵です。でも無敵ではありません。工夫次第で勝てます。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <OthelloBoard gameState={gameState} onCellClick={handleCellClick} />
          </div>
          
          <div className="space-y-6">
            <ScoreBoard gameState={gameState} />
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                新しいゲーム
              </button>
            </div>

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
};

export default OthelloGameComponent;