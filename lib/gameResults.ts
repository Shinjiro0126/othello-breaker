import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface GameResult {
  timestamp: Date;
  winner: 'B' | 'W' | 'tie';
  blackScore: number;
  whiteScore: number;
  moves: number;
}

/**
 * Save game result to Firestore
 * @param result Game result data
 * @returns Promise that resolves to the document ID on success, or rejects with an error on failure
 */
export async function saveGameResult(result: GameResult): Promise<string> {
  try {
    // Convert Date to Firestore Timestamp
    const firestoreData = {
      timestamp: Timestamp.fromDate(result.timestamp),
      winner: result.winner,
      blackScore: result.blackScore,
      whiteScore: result.whiteScore,
      moves: result.moves,
    };

    const docRef = await addDoc(collection(db, 'gameResults'), firestoreData);
    console.log('Game result saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
}
