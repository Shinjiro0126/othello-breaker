'use client';

import React from 'react';
import type { GameState, Piece } from '../types/game';

const CELL_SIZE = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16';
const PIECE_SIZE = 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12';

interface OthelloBoardProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
}

function OthelloBoard({ gameState, onCellClick }: OthelloBoardProps) {
  const renderCell = (piece: Piece, index: number) => {
    const isValidMove = gameState.validMoves.includes(index);
    const isLastMove = gameState.lastMove === index;

    return (
      <div
        key={index}
        className={`
          ${CELL_SIZE} border-2 border-emerald-700/50 bg-gradient-to-br from-emerald-600 to-green-600 
          flex items-center justify-center cursor-pointer hover:from-emerald-500 hover:to-green-500 
          transition-all duration-300 relative group
          ${isValidMove ? 'ring-4 ring-yellow-400 ring-inset shadow-lg shadow-yellow-400/50' : ''}
          ${isLastMove ? 'ring-4 ring-red-400 ring-inset shadow-lg shadow-red-400/50' : ''}
        `}
        onClick={() => onCellClick(index)}
      >
        {piece && (
          <div
            className={`
              ${PIECE_SIZE} rounded-full border-3 transition-all duration-300 shadow-2xl
              ${piece === 'B' ? 'bg-gradient-to-br from-gray-800 to-black border-gray-700' : 'bg-gradient-to-br from-white to-gray-100 border-gray-300'}
              ${isLastMove ? 'ring-4 ring-red-400 scale-110' : 'hover:scale-105'}
            `}
          />
        )}
        {isValidMove && !piece && (
          <div className={`${PIECE_SIZE} rounded-full bg-yellow-300/70 animate-pulse shadow-lg shadow-yellow-400/50`} />
        )}
      </div>
    );
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-800/30 to-green-900/30 p-6 rounded-3xl shadow-2xl border border-white/20 hover:shadow-emerald-500/20 transition-all duration-300">
      <div className="grid grid-cols-8 gap-1 p-2 bg-gradient-to-br from-emerald-700 to-green-800 rounded-2xl shadow-inner">
        {gameState.board.map((piece, index) => renderCell(piece, index))}
      </div>
    </div>
  );
}

export default OthelloBoard;
