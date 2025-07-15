// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsYwi0xc8gXssJaRRoC7Ne1u_CVfR_vdE",
  authDomain: "quick-hire-e0b40.firebaseapp.com",
  projectId: "quick-hire-e0b40",
  storageBucket: "quick-hire-e0b40.firebasestorage.app",
  messagingSenderId: "340524127298",
  appId: "1:340524127298:web:b76cdb0daaae874a73c9db",
  measurementId: "G-L19SGX8X61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth()