import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const getEnvOrThrow = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required Firebase environment variable: ${name}. ` +
        'Please ensure it is defined in your environment configuration.',
    );
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvOrThrow('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

function initializeFirebase(): { app: FirebaseApp; db: Firestore } {
  if (app && db) {
    return { app, db };
  }

  const apps = getApps();

  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }

  db = getFirestore(app);

  return { app, db };
}

export { initializeFirebase };
