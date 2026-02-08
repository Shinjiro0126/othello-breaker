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
export function calculateStats(results: GameResult[]) {
  const totalGames = results.length;
  const wins = results.filter(r => r.winner === 'B').length;
  const losses = results.filter(r => r.winner === 'W').length;
  const ties = results.filter(r => r.winner === 'tie').length;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  
  return {
    totalGames,
    wins,
    losses,
    ties,
    winRate: Math.round(winRate * 10) / 10, // 小数点1桁
  };
}
