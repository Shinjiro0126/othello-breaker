'use client';

import React from 'react';
import type { GameState, Piece } from '../types/game';

const CORNERS = [0, 7, 56, 63];

interface OthelloBoardProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
  isBreakSelecting?: boolean;
  onBreakSelect?: (index: number) => void;
}

function OthelloBoard({ gameState, onCellClick, isBreakSelecting = false, onBreakSelect }: OthelloBoardProps) {
  const renderCell = (piece: Piece, index: number) => {
    const isValidMove = gameState.validMoves.includes(index);
    const isLastMove = gameState.lastMove === index;

    // Break selection mode: highlight opponent (black) non-corner pieces
    const isBreakTarget = isBreakSelecting && piece === 'B' && !CORNERS.includes(index);
    const isBreakCorner = isBreakSelecting && piece === 'B' && CORNERS.includes(index);

    const handleClick = () => {
      if (isBreakSelecting) {
        if (isBreakTarget && onBreakSelect) {
          onBreakSelect(index);
        }
        return;
      }
      onCellClick(index);
    };

    const cellCursorClass = isBreakSelecting
      ? (isBreakTarget ? 'cursor-pointer hover:from-emerald-500 hover:to-green-500' : 'cursor-not-allowed')
      : 'cursor-pointer hover:from-emerald-500 hover:to-green-500';

    return (
      <div
        key={index}
        className={`
          w-full aspect-square border-2 border-emerald-700/50 bg-gradient-to-br from-emerald-600 to-green-600 
          flex items-center justify-center transition-all duration-300 relative group
          ${cellCursorClass}
          ${!isBreakSelecting && isValidMove ? 'ring-2 sm:ring-4 ring-yellow-400 ring-inset shadow-lg shadow-yellow-400/50' : ''}
          ${!isBreakSelecting && isLastMove ? 'ring-2 sm:ring-4 ring-red-400 ring-inset shadow-lg shadow-red-400/50' : ''}
          ${isBreakTarget ? 'ring-2 sm:ring-4 ring-yellow-400 ring-inset' : ''}
          ${isBreakCorner ? 'opacity-60' : ''}
        `}
        onClick={handleClick}
      >
        {piece && (
          <div
            className={`
              w-[75%] aspect-square rounded-full border-3 transition-all duration-300 shadow-2xl
              ${piece === 'B' ? 'bg-gradient-to-br from-gray-800 to-black border-gray-700' : 'bg-gradient-to-br from-white to-gray-100 border-gray-300'}
              ${!isBreakSelecting && isLastMove ? 'ring-2 sm:ring-4 ring-red-400 scale-110' : ''}
              ${isBreakTarget ? 'animate-break-pulse' : ''}
              ${!isBreakSelecting ? 'hover:scale-105' : ''}
            `}
          />
        )}
        {!isBreakSelecting && isValidMove && !piece && (
          <div className="w-[75%] aspect-square rounded-full bg-yellow-300/70 animate-pulse shadow-lg shadow-yellow-400/50" />
        )}
      </div>
    );
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-800/30 to-green-900/30 p-2 sm:p-6 rounded-3xl shadow-2xl border border-white/20 hover:shadow-emerald-500/20 transition-all duration-300 w-full aspect-square max-w-[600px] mx-auto">
      <div className="grid grid-cols-8 gap-1 p-2 bg-gradient-to-br from-emerald-700 to-green-800 rounded-2xl shadow-inner w-full h-full">
        {gameState.board.map((piece, index) => renderCell(piece, index))}
      </div>
    </div>
  );
}

export default OthelloBoard;
