import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAFWritm27m42n9UMlGevUUf41gMWHw38",
  authDomain: "teamtracker-7912a.firebaseapp.com",
  projectId: "teamtracker-7912a",
  storageBucket: "teamtracker-7912a.firebasestorage.app",
  messagingSenderId: "1065242200920",
  appId: "1:1065242200920:web:492eb4837075d04300f32d",
  measurementId: "G-W4YFHQPMZ9"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const matchesCollection = collection(db, "matches");