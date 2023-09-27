// ios 844204413625-tt508oeepjcqtau5jafb2h0a7a3gvqfg.apps.googleusercontent.com
// android  844204413625-mvr1qkgr2rptvdaamhgjm78g1mtu010m.apps.googleusercontent.com
// web 844204413625-jtlo2re6ca7h1jss9fdek0bn2tom985r.apps.googleusercontent.com
// SHA1 Fingerprint    1B:4C:C5:FF:EF:3C:5F:99:FB:3D:25:BB:7A:F2:DB:36:8F:B8:8F:3F
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjAMc7sriSyo4JWNjtiL4BVxq5-CFwC7c",
  authDomain: "telocambio-5abab.firebaseapp.com",
  projectId: "telocambio-5abab",
  storageBucket: "telocambio-5abab.appspot.com",
  messagingSenderId: "231713560463",
  appId: "1:231713560463:web:b3a57843294d8a4baaddfa",
  measurementId: "G-2R0FP4LD9D",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export { auth, appFirebase, db, storage };
