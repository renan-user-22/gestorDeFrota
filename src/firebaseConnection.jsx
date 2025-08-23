import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbQxnD3ZLiKyB5lwAb8NB18b6RVOGXqI0",
    authDomain: "fleet-48963.firebaseapp.com",
    databaseURL: "https://fleet-48963-default-rtdb.firebaseio.com",
    projectId: "fleet-48963",
    storageBucket: "fleet-48963.appspot.com", // corrigido aqui também
    messagingSenderId: "345938696401",
    appId: "1:345938696401:web:6a761ac5bf005b73decdf0"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Instâncias separadas
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Exporta
export { db, storage, auth, app };
