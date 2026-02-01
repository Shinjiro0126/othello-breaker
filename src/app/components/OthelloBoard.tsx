'use client';

import React from 'react';
import type { GameState, Piece } from '../types/game';

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

export default OthelloBoard;
