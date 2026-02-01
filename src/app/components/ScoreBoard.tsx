'use client';

import React from 'react';
import type { GameState } from '../types/game';

interface ScoreBoardProps {
  gameState: GameState;
}

function ScoreBoard({ gameState }: ScoreBoardProps) {
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
    </div>
  );
}

export default ScoreBoard;
