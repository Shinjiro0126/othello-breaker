'use client';

import React from 'react';
import type { GameState } from '../types/game';

interface ScoreBoardProps {
  gameState: GameState;
}

function ScoreBoard({ gameState }: ScoreBoardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">スコア</h2>
      
      <div className="space-y-4 mb-6">
        <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
          gameState.currentPlayer === 'B' 
            ? 'bg-gradient-to-r from-gray-800/80 to-black/80 border-gray-600 shadow-lg shadow-black/30 backdrop-blur-md scale-105' 
            : 'bg-white/10 border-white/20 backdrop-blur-sm'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full border-3 border-gray-600 shadow-xl"></div>
            <span className={`font-bold text-lg drop-shadow-lg ${
              gameState.currentPlayer === 'B' ? 'text-white' : 'text-white/80'
            }`}>
              CPU (黒)
            </span>
          </div>
          <span className={`font-bold text-3xl drop-shadow-lg ${
            gameState.currentPlayer === 'B' ? 'text-white' : 'text-white/80'
          }`}>
            {gameState.scores.black}
          </span>
        </div>
        
        <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
          gameState.currentPlayer === 'W' 
            ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 border-blue-400 shadow-lg shadow-blue-500/30 backdrop-blur-md scale-105' 
            : 'bg-white/10 border-white/20 backdrop-blur-sm'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full border-3 border-gray-300 shadow-xl"></div>
            <span className={`font-bold text-lg drop-shadow-lg ${
              gameState.currentPlayer === 'W' ? 'text-white' : 'text-white/80'
            }`}>
              あなた (白)
            </span>
          </div>
          <span className={`font-bold text-3xl drop-shadow-lg ${
            gameState.currentPlayer === 'W' ? 'text-white' : 'text-white/80'
          }`}>
            {gameState.scores.white}
          </span>
        </div>
      </div>

      {gameState.isThinking && (
        <div className="text-center p-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl mb-4 border border-blue-400/30 backdrop-blur-md">
          <div className="animate-pulse text-white font-medium drop-shadow-lg text-lg">
            🤔 Thinking…（最善手を検討中）
          </div>
        </div>
      )}

      {gameState.gamePhase === 'playing' && !gameState.isThinking && (
        <div className="text-center p-4 bg-white/20 rounded-2xl mb-4 border border-white/30 backdrop-blur-md">
          <span className="font-medium text-white drop-shadow-lg text-lg">
            {gameState.currentPlayer === 'W' ? '🎯 あなたの番です' : '⚡ CPUの番です'}
          </span>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
