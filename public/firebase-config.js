// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw6QxSJI5eq0C4-khu6AZVyA2voj3JA4o",
  authDomain: "bruno-e-julia.firebaseapp.com",
  projectId: "bruno-e-julia",
  storageBucket: "bruno-e-julia.firebasestorage.app",
  messagingSenderId: "764402762879",
  appId: "1:764402762879:web:79fe5ef7dc573bd5002b4a",
  measurementId: "G-XLYRHGNRF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('Firebase inicializado:', { app, db, auth });

export { app, analytics, db, auth };