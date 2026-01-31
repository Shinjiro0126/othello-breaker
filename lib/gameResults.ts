import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from './firebase';

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
  // Validate input data
  if (!result.timestamp || !(result.timestamp instanceof Date) || isNaN(result.timestamp.getTime())) {
    throw new Error('Invalid timestamp: must be a valid Date object');
  }
  
  if (!['B', 'W', 'tie'].includes(result.winner)) {
    throw new Error(`Invalid winner value: must be 'B', 'W', or 'tie'`);
  }
  
  if (typeof result.blackScore !== 'number' || result.blackScore < 0 || result.blackScore > 64 || !Number.isInteger(result.blackScore)) {
    throw new Error('Invalid blackScore: must be a non-negative integer between 0 and 64');
  }
  
  if (typeof result.whiteScore !== 'number' || result.whiteScore < 0 || result.whiteScore > 64 || !Number.isInteger(result.whiteScore)) {
    throw new Error('Invalid whiteScore: must be a non-negative integer between 0 and 64');
  }
  
  if (result.blackScore + result.whiteScore > 64) {
    throw new Error('Invalid scores: total number of pieces cannot exceed 64');
  }
  
  if (typeof result.moves !== 'number' || result.moves < 0 || !Number.isInteger(result.moves)) {
    throw new Error('Invalid moves: must be a non-negative integer');
  }

  try {
    // Initialize Firebase lazily
    const { db } = initializeFirebase();
    
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
