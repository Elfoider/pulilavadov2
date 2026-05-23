import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCBaQcCu1YeHXoJYJ2qhWteg-wIChL8dOA",
  authDomain: "mrespumasystem.firebaseapp.com",
  projectId: "mrespumasystem",
  storageBucket: "mrespumasystem.firebasestorage.app",
  messagingSenderId: "889894946879",
  appId: "1:889894946879:web:b2d9864c85bd6ae375108a"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export function assertDb() {
  if (!db) {
    throw new Error(
      "Firebase no está configurado. Revisa variables NEXT_PUBLIC_FIREBASE_*",
    );
  } else {
    console.log("Firebase DB initialized successfully");
  }
  return db;
}
