import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBaQcCu1YeHXoJYJ2qhWteg-wIChL8dOA",
  authDomain: "mrespumasystem.firebaseapp.com",
  projectId: "mrespumasystem",
  storageBucket: "mrespumasystem.firebasestorage.app",
  messagingSenderId: "889894946879",
  appId: "1:889894946879:web:b2d9864c85bd6ae375108a"
};

const hasFirebaseEnv = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp = hasFirebaseEnv
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;

export function assertDb() {
  if (!db) {
    throw new Error("Firebase no está configurado. Revisa variables NEXT_PUBLIC_FIREBASE_*");
  }
  return db;
}
