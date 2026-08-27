import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxFX26QBUsq7cEjHlfv_i2sgUssmy3toc",
  authDomain: "yez-bee-site.firebaseapp.com",
  projectId: "yez-bee-site",
  storageBucket: "yez-bee-site.firebasestorage.app",
  messagingSenderId: "835150478056",
  appId: "1:835150478056:web:f6911603770e46be13275d",
  measurementId: "G-KMY3EGZNCG"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Initialize Analytics safely (only on client side)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };
