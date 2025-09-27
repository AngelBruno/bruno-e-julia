// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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