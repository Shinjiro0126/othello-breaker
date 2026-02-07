// AI評価関数とヘルパー
import { Piece } from '../types/game';

export class OthelloAI {
  private static readonly BOARD_SIZE = 8;
  private static readonly CORNER_POSITIONS = [0, 7, 56, 63];
  private static readonly EDGE_POSITIONS = [
    1, 2, 3, 4, 5, 6,      // 上辺
    8, 16, 24, 32, 40, 48, // 左辺
    15, 23, 31, 39, 47, 55, // 右辺
    57, 58, 59, 60, 61, 62  // 下辺
  ];
  private static readonly X_SQUARE_POSITIONS = [1, 6, 8, 15, 48, 55, 57, 62];
  private static readonly C_SQUARE_POSITIONS = [9, 14, 49, 54];

  // Zobrist ハッシュテーブル
  private static zobristTable: number[] | null = null;
  private static transpositionTable = new Map<string, { score: number; depth: number; move: number | null; flag: 'exact' | 'alpha' | 'beta' }>();

  static initZobrist() {
    if (this.zobristTable) return;
    
    this.zobristTable = Array(128).fill(0);
    for (let i = 0; i < 128; i++) {
      this.zobristTable[i] = Math.floor(Math.random() * 0x7FFFFFFF);
    }
  }

  static zobristHash(board: Piece[]): string {
    if (!this.zobristTable) this.initZobrist();
    
    let hash = 0;
    for (let i = 0; i < 64; i++) {
      if (board[i] === 'B') {
        hash ^= this.zobristTable![i * 2];
      } else if (board[i] === 'W') {
        hash ^= this.zobristTable![i * 2 + 1];
      }
    }
    return hash.toString();
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
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const currentFlipped: number[] = [];
      let r = row + dr;
      let c = col + dc;

      while (this.isValidPosition(r, c)) {
        const index = this.coordToIndex(r, c);
        const piece = board[index];
        
        if (piece === null) break;
        if (piece === player) {
          flippedPieces.push(...currentFlipped);
          break;
        }
        currentFlipped.push(index);
        r += dr;
        c += dc;
      }
    }

    return flippedPieces;
  }

  static getValidMoves(board: Piece[], player: 'B' | 'W'): number[] {
    const validMoves: number[] = [];
    for (let i = 0; i < 64; i++) {
      if (this.getFlippedPieces(board, i, player).length > 0) {
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

  // 評価関数
  static evaluate(board: Piece[], player: 'B' | 'W'): number {
    const counts = this.countPieces(board);
    const emptyCount = 64 - counts.black - counts.white;
    
    // 終盤は完全読みなのでここは呼ばれないはず
    if (emptyCount <= 14) {
      return this.evaluateEndgame(board, player);
    }

    let score = 0;
    const opponent = player === 'B' ? 'W' : 'B';

    // 1. モビリティ（合法手の数）
    const playerMoves = this.getValidMoves(board, player).length;
    const opponentMoves = this.getValidMoves(board, opponent).length;
    score += (playerMoves - opponentMoves) * 10;

    // 2. 位置評価
    score += this.evaluatePositions(board, player);

    // 3. フロンティア（隣接する空きマス数の少なさ）
    score += this.evaluateFrontier(board, player) * 5;

    // 4. パリティ（空きマスの奇偶性）
    if (emptyCount <= 20) {
      score += this.evaluateParity(emptyCount, player) * 2;
    }

    return score;
  }

  static evaluateEndgame(board: Piece[], player: 'B' | 'W'): number {
    const counts = this.countPieces(board);
    const myCount = player === 'B' ? counts.black : counts.white;
    const opponentCount = player === 'B' ? counts.white : counts.black;
    return (myCount - opponentCount) * 1000;
  }

  static evaluatePositions(board: Piece[], player: 'B' | 'W'): number {
    let score = 0;
    const opponent = player === 'B' ? 'W' : 'B';

    for (let i = 0; i < 64; i++) {
      const piece = board[i];
      if (piece === null) continue;

      let positionValue = 0;

      // 角
      if (this.CORNER_POSITIONS.includes(i)) {
        positionValue = 100;
      }
      // 辺
      else if (this.EDGE_POSITIONS.includes(i)) {
        positionValue = 20;
      }
      // X打ち（角の隣）
      else if (this.X_SQUARE_POSITIONS.includes(i)) {
        positionValue = -30;
      }
      // C打ち（角の斜め隣）
      else if (this.C_SQUARE_POSITIONS.includes(i)) {
        positionValue = -20;
      }

      if (piece === player) {
        score += positionValue;
      } else if (piece === opponent) {
        score -= positionValue;
      }
    }

    return score;
  }

  static evaluateFrontier(board: Piece[], player: 'B' | 'W'): number {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    let playerFrontier = 0;
    let opponentFrontier = 0;
    const opponent = player === 'B' ? 'W' : 'B';

    for (let i = 0; i < 64; i++) {
      if (board[i] === null) continue;

      const [row, col] = this.indexToCoord(i);
      let hasEmptyNeighbor = false;

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (this.isValidPosition(newRow, newCol)) {
          const neighborIndex = this.coordToIndex(newRow, newCol);
          if (board[neighborIndex] === null) {
            hasEmptyNeighbor = true;
            break;
          }
        }
      }

      if (hasEmptyNeighbor) {
        if (board[i] === player) {
          playerFrontier++;
        } else if (board[i] === opponent) {
          opponentFrontier++;
        }
      }
    }

    return opponentFrontier - playerFrontier;
  }

  static evaluateParity(emptyCount: number, player: 'B' | 'W'): number {
    // パリティ: 最後に打つのが有利
    const isPlayerEven = player === 'B'; // 黒は先手なので奇数回目に打つ
    const isEmptyEven = emptyCount % 2 === 0;
    
    return (isPlayerEven === isEmptyEven) ? 5 : -5;
  }

  // ムーブオーダリング
  static orderMoves(board: Piece[], moves: number[], player: 'B' | 'W'): number[] {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // 角を最優先
      if (this.CORNER_POSITIONS.includes(a)) scoreA += 1000;
      if (this.CORNER_POSITIONS.includes(b)) scoreB += 1000;

      // 辺を優先
      if (this.EDGE_POSITIONS.includes(a)) scoreA += 100;
      if (this.EDGE_POSITIONS.includes(b)) scoreB += 100;

      // X打ちとC打ちを避ける
      if (this.X_SQUARE_POSITIONS.includes(a)) scoreA -= 300;
      if (this.X_SQUARE_POSITIONS.includes(b)) scoreB -= 300;
      if (this.C_SQUARE_POSITIONS.includes(a)) scoreA -= 200;
      if (this.C_SQUARE_POSITIONS.includes(b)) scoreB -= 200;

      // ひっくり返せる数
      const flippedA = this.getFlippedPieces(board, a, player).length;
      const flippedB = this.getFlippedPieces(board, b, player).length;
      scoreA += flippedA;
      scoreB += flippedB;

      return scoreB - scoreA;
    });
  }

  // Negamax + Alpha-Beta pruning
  static negamax(
    board: Piece[], 
    depth: number, 
    alpha: number, 
    beta: number, 
    player: 'B' | 'W',
    deadline: number,
    endgameSolverThreshold: number = 14
  ): { score: number; move: number | null } {
    // 時間切れチェック
    if (Date.now() >= deadline) {
      return { score: 0, move: null };
    }

    const opponent = player === 'B' ? 'W' : 'B';
    const hash = this.zobristHash(board);
    
    // トランスポジションテーブルから検索
    const cached = this.transpositionTable.get(hash);
    if (cached && cached.depth >= depth) {
      if (cached.flag === 'exact') {
        return { score: cached.score, move: cached.move };
      } else if (cached.flag === 'alpha' && cached.score <= alpha) {
        return { score: cached.score, move: cached.move };
      } else if (cached.flag === 'beta' && cached.score >= beta) {
        return { score: cached.score, move: cached.move };
      }
    }

    const moves = this.getValidMoves(board, player);
    
    // パスの場合
    if (moves.length === 0) {
      const opponentMoves = this.getValidMoves(board, opponent);
      if (opponentMoves.length === 0) {
        // ゲーム終了
        const finalScore = this.evaluateEndgame(board, player);
        return { score: finalScore, move: null };
      } else {
        // パス
        const result = this.negamax(board, depth - 1, -beta, -alpha, opponent, deadline, endgameSolverThreshold);
        return { score: -result.score, move: null };
      }
    }

    const emptyCount = 64 - this.countPieces(board).black - this.countPieces(board).white;
    
    // 終盤完全読み (check endgame before depth limit)
    if (endgameSolverThreshold > 0 && emptyCount <= endgameSolverThreshold) {
      return this.negamaxEndgame(board, alpha, beta, player, deadline);
    }
    
    if (depth <= 0) {
      const score = this.evaluate(board, player);
      return { score, move: moves[0] };
    }

    // 通常の探索
    const orderedMoves = this.orderMoves(board, moves, player);
    let bestScore = -Infinity;
    let bestMove = orderedMoves[0];

    for (const move of orderedMoves) {
      if (Date.now() >= deadline) break;

      const newBoard = this.makeMove(board, move, player);
      if (!newBoard) continue;

      const result = this.negamax(newBoard, depth - 1, -beta, -alpha, opponent, deadline, endgameSolverThreshold);
      const score = -result.score;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, score);
      if (alpha >= beta) {
        break; // Beta cutoff
      }
    }

    // トランスポジションテーブルに保存
    let flag: 'exact' | 'alpha' | 'beta' = 'exact';
    if (bestScore <= alpha) flag = 'alpha';
    else if (bestScore >= beta) flag = 'beta';
    
    this.transpositionTable.set(hash, {
      score: bestScore,
      depth,
      move: bestMove,
      flag
    });

    return { score: bestScore, move: bestMove };
  }

  static negamaxEndgame(
    board: Piece[], 
    alpha: number, 
    beta: number, 
    player: 'B' | 'W',
    deadline: number
  ): { score: number; move: number | null } {
    if (Date.now() >= deadline) {
      return { score: 0, move: null };
    }

    const opponent = player === 'B' ? 'W' : 'B';
    const moves = this.getValidMoves(board, player);
    
    if (moves.length === 0) {
      const opponentMoves = this.getValidMoves(board, opponent);
      if (opponentMoves.length === 0) {
        const finalScore = this.evaluateEndgame(board, player);
        return { score: finalScore, move: null };
      } else {
        const result = this.negamaxEndgame(board, -beta, -alpha, opponent, deadline);
        return { score: -result.score, move: null };
      }
    }

    const orderedMoves = this.orderMoves(board, moves, player);
    let bestScore = -Infinity;
    let bestMove = orderedMoves[0];

    for (const move of orderedMoves) {
      if (Date.now() >= deadline) break;

      const newBoard = this.makeMove(board, move, player);
      if (!newBoard) continue;

      const result = this.negamaxEndgame(newBoard, -beta, -alpha, opponent, deadline);
      const score = -result.score;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, score);
      if (alpha >= beta) {
        break;
      }
    }

    return { score: bestScore, move: bestMove };
  }

  // 反復深化
  static findBestMove(
    board: Piece[], 
    player: 'B' | 'W', 
    timeMs: number, 
    maxDepth: number = 15,
    useIterativeDeepening: boolean = true,
    endgameSolverThreshold: number = 14
  ): number | null {
    const startTime = Date.now();
    const deadline = startTime + timeMs * 0.9; // 余裕をもって90%の時間で切り上げ
    
    this.initZobrist();
    this.transpositionTable.clear();

    const moves = this.getValidMoves(board, player);
    if (moves.length === 0) return null;

    // ムーブオーダリングを先に実行
    const orderedMoves = this.orderMoves(board, moves, player);
    
    // 安全な初期手（角優先）
    let bestMove = orderedMoves[0];

    // 反復深化を使わない場合は直接maxDepthで探索
    if (!useIterativeDeepening) {
      try {
        const result = this.negamax(board, maxDepth, -Infinity, Infinity, player, deadline, endgameSolverThreshold);
        if (result.move !== null && moves.includes(result.move)) {
          bestMove = result.move;
        }
      } catch (error) {
        console.warn('AI negamax error at depth', maxDepth, error);
      }
      return bestMove;
    }

    // 反復深化
    for (let depth = 1; depth <= maxDepth; depth++) {
      if (Date.now() >= deadline) break;

      try {
        const result = this.negamax(board, depth, -Infinity, Infinity, player, deadline, endgameSolverThreshold);
        
        if (result.move !== null && Date.now() < deadline && moves.includes(result.move)) {
          bestMove = result.move;
        }
        
        // 時間切れが近い場合は終了（残り時間が平均思考時間より短い）
        const elapsed = Date.now() - startTime;
        const avgTimePerDepth = elapsed / depth;
        if (Date.now() + avgTimePerDepth * 1.5 >= deadline) {
          break;
        }
      } catch (error) {
        // エラーが発生した場合は前回の結果を使用
        console.warn('AI negamax error at depth', depth, error);
        break;
      }
    }

    return bestMove;
  }
}