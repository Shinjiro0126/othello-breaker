import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

export interface GameResult {
  timestamp: Date;
  winner: 'B' | 'W' | 'tie';
  blackScore: number;
  whiteScore: number;
  totalMoves: number;
  difficulty?: 'beginner' | 'normal' | 'hard' | 'master';
  playerWon: boolean; // プレイヤー（白）が勝利したかどうか
}

const COLLECTION_NAME = 'gameResults';

/**
 * ゲーム結果をFirestoreに保存
 */
export async function saveGameResult(result: Omit<GameResult, 'timestamp'>): Promise<string | null> {
  try {
    console.log('Attempting to save game result to Firestore...', result);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...result,
      timestamp: Timestamp.now(),
    });
    console.log('✓ Game result saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('✗ Error saving game result to Firestore:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

/**
 * 最新のゲーム結果を取得
 */
export async function getRecentGameResults(count: number = 10): Promise<GameResult[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        timestamp: data.timestamp.toDate(),
        winner: data.winner,
        blackScore: data.blackScore,
        whiteScore: data.whiteScore,
        totalMoves: data.totalMoves,
        difficulty: data.difficulty,
        playerWon: data.playerWon ?? (data.winner === 'W'), // 互換性のため既存データも処理
      };
    });
  } catch (error) {
    console.error('Error fetching game results:', error);
    return [];
  }
}

/**
 * すべてのゲーム結果を取得（統計用）
 */
export async function getAllGameResults(): Promise<GameResult[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        timestamp: data.timestamp.toDate(),
        winner: data.winner,
        blackScore: data.blackScore,
        whiteScore: data.whiteScore,
        totalMoves: data.totalMoves,
        difficulty: data.difficulty,
        playerWon: data.playerWon ?? (data.winner === 'W'), // 互換性のため既存データも処理
      };
    });
  } catch (error) {
    console.error('Error fetching all game results:', error);
    return [];
  }
}

/**
 * 統計情報を計算
 */
export function calculateStats(results: GameResult[], difficulty?: 'beginner' | 'normal' | 'hard' | 'master') {
  // 難易度でフィルタリング
  const filteredResults = difficulty 
    ? results.filter(r => r.difficulty === difficulty)
    : results;
  
  const totalGames = filteredResults.length;
  const wins = filteredResults.filter(r => r.playerWon).length; // プレイヤーの勝利
  const losses = filteredResults.filter(r => !r.playerWon && r.winner !== 'tie').length;
  const ties = filteredResults.filter(r => r.winner === 'tie').length;
  
  return {
    totalGames,
    wins,
    losses,
    ties,
  };
}
