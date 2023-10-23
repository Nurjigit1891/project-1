import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyAEC6p5i6rD-3TfPOLJrnMRMRzSaA4xyIY",
    authDomain: "test-database-firebase-nurba3.firebaseapp.com",
    projectId: "test-database-firebase-nurba3",
    storageBucket: "test-database-firebase-nurba3.appspot.com",
    messagingSenderId: "986129708198",
    appId: "1:986129708198:web:af19bf5c7f2cc194bc3067",
    measurementId: "G-Y05YPS0PM8"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage()
export const db = getFirestore(app);
