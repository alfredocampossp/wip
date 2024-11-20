import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importação para autenticação

const firebaseConfig = {
    apiKey: "AIzaSyCJNx-f6CO92R2FIN-FipFz_8mxGLuG9ro",
    authDomain: "projeto-wip.firebaseapp.com",
    projectId: "projeto-wip",
    storageBucket: "projeto-wip.firebasestorage.app",
    messagingSenderId: "958969739065",
    appId: "1:958969739065:web:f8aa73983ba3e1d8c39ae8",
    measurementId: "G-EV36GQYLRW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa o serviço de autenticação

export { db, auth };