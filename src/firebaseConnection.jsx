// Firebase (v9 modular) — sem Auth
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// 👉 Use .env.* com prefixo VITE_ (Vite) quando puder
const firebaseConfig = {
  apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY || 'AIzaSyBbQxnD3ZLiKyB5lwAb8NB18b6RVOGXqI0',
  authDomain: import.meta?.env?.VITE_FIREBASE_AUTH_DOMAIN || 'fleet-48963.firebaseapp.com',
  databaseURL: import.meta?.env?.VITE_FIREBASE_DATABASE_URL || 'https://fleet-48963-default-rtdb.firebaseio.com',
  projectId: import.meta?.env?.VITE_FIREBASE_PROJECT_ID || 'fleet-48963',
  storageBucket: import.meta?.env?.VITE_FIREBASE_STORAGE_BUCKET || 'fleet-48963.appspot.com',
  messagingSenderId: import.meta?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '345938696401',
  appId: import.meta?.env?.VITE_FIREBASE_APP_ID || '1:345938696401:web:6a761ac5bf005b73decdf0',
};

// Singleton: evita “Firebase App named '[DEFAULT]' already exists”
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Apenas o que você usa AGORA
export const db = getDatabase(app);
export const storage = getStorage(app);

// ❌ Não exporte `auth` enquanto não for usar
// import { getAuth } from 'firebase/auth'  // <- removido
// export const auth = getAuth(app);        // <- removido

export default app;
