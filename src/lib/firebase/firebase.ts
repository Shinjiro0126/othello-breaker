import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// デバッグ用: 設定が読み込まれているか確認
if (typeof window !== 'undefined') {
  console.log('Firebase configuration status:', {
    apiKey: firebaseConfig.apiKey ? '✓ Loaded' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Loaded' : '✗ Missing',
    projectId: firebaseConfig.projectId || '✗ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✓ Loaded' : '✗ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Loaded' : '✗ Missing',
    appId: firebaseConfig.appId ? '✓ Loaded' : '✗ Missing',
  });
}

// Firebaseの設定が不完全な場合は警告
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Check environment variables.');
}

// Initialize Firebase (シングルトンパターン)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
