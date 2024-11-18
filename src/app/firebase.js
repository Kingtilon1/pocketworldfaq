import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "highrise-50bb7.firebaseapp.com",
    projectId: "highrise-50bb7",
    storageBucket: "highrise-50bb7.firebasestorage.app",
    messagingSenderId: "855072600223",
    appId: "1:855072600223:web:5e630bf181ef06c84ef2aa"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
