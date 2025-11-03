// src/firebaseConnection.jsx
import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// 🔥 Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDTpBmmqESLtsyiIwvtFR0u2hLJ2oeYZ8",
  authDomain: "fleet-solutions-a4a77.firebaseapp.com",
  databaseURL: "https://fleet-solutions-a4a77-default-rtdb.firebaseio.com",
  projectId: "fleet-solutions-a4a77",
  storageBucket: "fleet-solutions-a4a77.firebasestorage.app",
  messagingSenderId: "953714428251",
  appId: "1:953714428251:web:e8cf7bf7cdb926718e727e",
  measurementId: "G-5Q734BKGVF"
};

// Evita “Firebase App named '[DEFAULT]' already exists” no HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// export const auth = getAuth(app);
export const db = getDatabase(app);

// ✅ Exporta dos dois jeitos para compatibilidade:
export { app };       // named export
export default app;   // default export
