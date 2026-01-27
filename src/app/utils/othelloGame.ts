import { Piece } from '../types/game';

export class OthelloGame {
  private static readonly BOARD_SIZE = 8;
  private static readonly DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  static createInitialBoard(): Piece[] {
    const board = new Array(64).fill(null);
    // 初期配置: 中央の4マス
    board[27] = 'W'; // (3,3)
    board[28] = 'B'; // (3,4)
    board[35] = 'B'; // (4,3)
    board[36] = 'W'; // (4,4)
    return board;
  }

  static indexToCoord(index: number): [number, number] {
    return [Math.floor(index / 8), index % 8];
  }

  static coordToIndex(row: number, col: number): number {
    return row * 8 + col;
  }

  static isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  static getFlippedPieces(board: Piece[], position: number, player: 'B' | 'W'): number[] {
    if (board[position] !== null) return [];

    const [row, col] = this.indexToCoord(position);
    const flippedPieces: number[] = [];

    for (const [dr, dc] of this.DIRECTIONS) {
      const currentFlipped: number[] = [];
      let r = row + dr;
      let c = col + dc;

      // まず反対色の駒を収集
      while (this.isValidPosition(r, c)) {
        const index = this.coordToIndex(r, c);
        const piece = board[index];
        
        if (piece === null) break;
        if (piece === player) {
          // 自分の駒に到達 → この方向の駒をすべてひっくり返せる
          flippedPieces.push(...currentFlipped);
          break;
        }
        // 相手の駒なので候補に追加
        currentFlipped.push(index);
        r += dr;
        c += dc;
      }
    }

    return flippedPieces;
  }

  static isValidMove(board: Piece[], position: number, player: 'B' | 'W'): boolean {
    return this.getFlippedPieces(board, position, player).length > 0;
  }

  static getValidMoves(board: Piece[], player: 'B' | 'W'): number[] {
    const validMoves: number[] = [];
    for (let i = 0; i < 64; i++) {
      if (this.isValidMove(board, i, player)) {
        validMoves.push(i);
      }
    }
    return validMoves;
  }

  static makeMove(board: Piece[], position: number, player: 'B' | 'W'): Piece[] | null {
    const flippedPieces = this.getFlippedPieces(board, position, player);
    if (flippedPieces.length === 0) return null;

    const newBoard = [...board];
    newBoard[position] = player;
    
    // ひっくり返す
    for (const index of flippedPieces) {
      newBoard[index] = player;
    }

    return newBoard;
  }

  static countPieces(board: Piece[]): { black: number; white: number } {
    let black = 0;
    let white = 0;
    
    for (const piece of board) {
      if (piece === 'B') black++;
      else if (piece === 'W') white++;
    }

    return { black, white };
  }

  static isGameOver(board: Piece[]): boolean {
    const blackMoves = this.getValidMoves(board, 'B');
    const whiteMoves = this.getValidMoves(board, 'W');
    return blackMoves.length === 0 && whiteMoves.length === 0;
  }

  static getWinner(board: Piece[]): 'B' | 'W' | 'tie' | null {
    if (!this.isGameOver(board)) return null;
    
    const { black, white } = this.countPieces(board);
    if (black > white) return 'B';
    if (white > black) return 'W';
    return 'tie';
  }
}