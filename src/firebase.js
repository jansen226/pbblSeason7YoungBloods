import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, writeBatch, doc } from "firebase/firestore";

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

export const INITIAL_MATCHES = [
  { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
  { date: "2026-08-30", player: "MCaibal", position: 2, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
  { date: "2026-08-30", player: "JRianzares", position: 3, opponent: "HOBBY WORKS CAFE X BNG", result: "Loss" },
  { date: "2026-08-30", player: "JMinosa", position: 4, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
  { date: "2026-08-30", player: "RSulit", position: 5, opponent: "HOBBY WORKS CAFE X BNG", result: "Loss" },
  { date: "2026-08-30", player: "RSulit", position: 1, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
  { date: "2026-08-30", player: "JLanzado", position: 2, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
  { date: "2026-08-30", player: "EBaet", position: 3, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
  { date: "2026-08-30", player: "JLirio", position: 4, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
  { date: "2026-08-30", player: "JCruz", position: 5, opponent: "ICEMATSURI D`SOURCE", result: "Loss" },
  { date: "2026-08-30", player: "EBaet", position: 1, opponent: "Anonymous Bladers PH", result: "Loss" },
  { date: "2026-08-30", player: "JLirio", position: 2, opponent: "Anonymous Bladers PH", result: "Loss" },
  { date: "2026-08-30", player: "JBrual", position: 3, opponent: "Anonymous Bladers PH", result: "Loss" },
  { date: "2026-08-30", player: "JCruz", position: 4, opponent: "Anonymous Bladers PH", result: "Win" },
  { date: "2026-08-30", player: "JRianzares", position: 5, opponent: "Anonymous Bladers PH", result: "Loss" },
  { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "Garuda Phoenix", result: "Win" },
  { date: "2026-08-30", player: "RSulit", position: 2, opponent: "Garuda Phoenix", result: "Win" },
  { date: "2026-08-30", player: "MCaibal", position: 3, opponent: "Garuda Phoenix", result: "Win" },
  { date: "2026-08-30", player: "JMinosa", position: 4, opponent: "Garuda Phoenix", result: "Loss" },
  { date: "2026-08-30", player: "JBrual", position: 5, opponent: "Garuda Phoenix", result: "Win" },
  { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "Ignited Fury", result: "Loss" },
  { date: "2026-08-30", player: "RSulit", position: 2, opponent: "Ignited Fury", result: "Win" },
  { date: "2026-08-30", player: "EBaet", position: 3, opponent: "Ignited Fury", result: "Win" },
  { date: "2026-08-30", player: "JCruz", position: 4, opponent: "Ignited Fury", result: "Win" },
  { date: "2026-08-30", player: "JBrual", position: 5, opponent: "Ignited Fury", result: "Win" },
  { date: "2026-08-30", player: "JMinosa", position: 1, opponent: "BBA Yappie", result: "Loss" },
  { date: "2026-08-30", player: "MCaibal", position: 2, opponent: "BBA Yappie", result: "Win" },
  { date: "2026-08-30", player: "JRianzares", position: 3, opponent: "BBA Yappie", result: "Win" },
  { date: "2026-08-30", player: "JLirio", position: 4, opponent: "BBA Yappie", result: "Loss" },
  { date: "2026-08-30", player: "EBaet", position: 5, opponent: "BBA Yappie", result: "Loss" },
  { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "Sinflare", result: "Loss" },
  { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "Sinflare", result: "Win" },
  { date: "2026-09-06", player: "JCruz", position: 3, opponent: "Sinflare", result: "Win" },
  { date: "2026-09-06", player: "JMinosa", position: 4, opponent: "Sinflare", result: "Loss" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Sinflare", result: "Win" },
  { date: "2026-09-06", player: "RSulit", position: 1, opponent: "Shinzoku", result: "Win" },
  { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "Shinzoku", result: "Loss" },
  { date: "2026-09-06", player: "JCruz", position: 3, opponent: "Shinzoku", result: "Loss" },
  { date: "2026-09-06", player: "JRianzares", position: 4, opponent: "Shinzoku", result: "Win" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Shinzoku", result: "Win" },
  { date: "2026-09-06", player: "RSulit", position: 1, opponent: "Code Unknown Iris", result: "Win" },
  { date: "2026-09-06", player: "EBaet", position: 2, opponent: "Code Unknown Iris", result: "Loss" },
  { date: "2026-09-06", player: "JRianzares", position: 3, opponent: "Code Unknown Iris", result: "Loss" },
  { date: "2026-09-06", player: "JLirio", position: 4, opponent: "Code Unknown Iris", result: "Win" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Code Unknown Iris", result: "Win" },
  { date: "2026-09-06", player: "RSulit", position: 1, opponent: "J365 Royals", result: "Loss" },
  { date: "2026-09-06", player: "JLanzado", position: 2, opponent: "J365 Royals", result: "Loss" },
  { date: "2026-09-06", player: "JLirio", position: 3, opponent: "J365 Royals", result: "Loss" },
  { date: "2026-09-06", player: "JMinosa", position: 4, opponent: "J365 Royals", result: "Loss" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "J365 Royals", result: "Win" },
  { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "SUNACCHI NIDAI", result: "Win" },
  { date: "2026-09-06", player: "RSulit", position: 2, opponent: "SUNACCHI NIDAI", result: "Loss" },
  { date: "2026-09-06", player: "MCaibal", position: 3, opponent: "SUNACCHI NIDAI", result: "Loss" },
  { date: "2026-09-06", player: "JCruz", position: 4, opponent: "SUNACCHI NIDAI", result: "Win" },
  { date: "2026-09-06", player: "JRianzares", position: 5, opponent: "SUNACCHI NIDAI", result: "Win" },
  { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "Skyclaw Plus Ultra", result: "Loss" },
  { date: "2026-09-06", player: "JMinosa", position: 2, opponent: "Skyclaw Plus Ultra", result: "Loss" },
  { date: "2026-09-06", player: "EBaet", position: 3, opponent: "Skyclaw Plus Ultra", result: "Loss" },
  { date: "2026-09-06", player: "JLirio", position: 4, opponent: "Skyclaw Plus Ultra", result: "Win" },
  { date: "2026-09-06", player: "JRianzares", position: 5, opponent: "Skyclaw Plus Ultra", result: "Win" },
  { date: "2026-09-06", player: "RSulit", position: 1, opponent: "BBA Shirokuro Sharks", result: "Win" },
  { date: "2026-09-06", player: "JLirio", position: 2, opponent: "BBA Shirokuro Sharks", result: "Win" },
  { date: "2026-09-06", player: "JRianzares", position: 3, opponent: "BBA Shirokuro Sharks", result: "Win" },
  { date: "2026-09-06", player: "JCruz", position: 4, opponent: "BBA Shirokuro Sharks", result: "Loss" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "BBA Shirokuro Sharks", result: "Win" },
  { date: "2026-09-06", player: "EBaet", position: 1, opponent: "IKG | TCG", result: "Win" },
  { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "IKG | TCG", result: "Win" },
  { date: "2026-09-06", player: "JCruz", position: 3, opponent: "IKG | TCG", result: "Loss" },
  { date: "2026-09-06", player: "JLirio", position: 4, opponent: "IKG | TCG", result: "Loss" },
  { date: "2026-09-06", player: "JBrual", position: 5, opponent: "IKG | TCG", result: "Win" },
  { date: "2026-09-06", player: "EBaet", position: 1, opponent: "INVICTUS", result: "Win" },
  { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "INVICTUS", result: "Win" },
  { date: "2026-09-06", player: "JMinosa", position: 3, opponent: "INVICTUS", result: "Win" },
  { date: "2026-09-06", player: "JRianzares", position: 4, opponent: "INVICTUS", result: "Win" },
  { date: "2026-09-06", player: "JLanzado", position: 5, opponent: "INVICTUS", result: "Loss" }
];

export const seedInitialMatchesIfEmpty = async () => {
  try {
    const snapshot = await getDocs(matchesCollection);

    if (snapshot.empty) {
      console.log('Matches collection is empty. Seeding initial matches...');
      const batch = writeBatch(db);

      INITIAL_MATCHES.forEach((match) => {
        const newDocRef = doc(matchesCollection);
        batch.set(newDocRef, match);
      });

      await batch.commit();
      console.log('Successfully seeded initial matches to Firestore!');
    } else {
      console.log('Matches already exist in Firestore. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding initial match data:', error);
  }
};