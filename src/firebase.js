import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration for hark-9a030
const firebaseConfig = {
  apiKey: "AIzaSyChFChUXNIxS8pX1aXKUtVdbwMmZ2K1bn8",
  authDomain: "hark-9a030.firebaseapp.com",
  projectId: "hark-9a030",
  storageBucket: "hark-9a030.firebasestorage.app",
  messagingSenderId: "937277653707",
  appId: "1:937277653707:web:75194ddc9e0c875728114e",
  measurementId: "G-JTBR5SH00S"
};

// Prevent initializing Firebase multiple times during hot-reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Optional Analytics (only runs in browser environments)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Diagnostic logger - verify in browser console that project ID is hark-9a030
console.log("🔥 Active Firebase Project:", app.options.projectId);

// Initialize Firestore DB
export const db = getFirestore(app);

// Export collection reference for Beyblade Tracker
export const matchesCollection = collection(db, "matches");

export default app;