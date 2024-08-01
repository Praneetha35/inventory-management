// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_vZRSyDO7isRDqucLC4sNx-FxpFiZmGs",
  authDomain: "inventory-management-13b86.firebaseapp.com",
  projectId: "inventory-management-13b86",
  storageBucket: "inventory-management-13b86.appspot.com",
  messagingSenderId: "938923168593",
  appId: "1:938923168593:web:527339f469c46cb2c2b970",
  measurementId: "G-ERZ0ZY5TDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Conditionally initialize analytics
// isSupported().then(yes => {
//   if (yes) {
//     analytics = getAnalytics(app);
//   }
// }).catch(e => console.error('Analytics not supported:', e));

const firestore = getFirestore(app)


export { firestore };