import { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/* 
  1 npm firebase 
  2 initialzeApp
  3 call getStorage 
  4 create ref for storage
  5 create ref for images
*/

let app;

export default function firebaseInit(){
  if(!app){
    app = initializeApp(firebaseConfig);
  }
  // Initialize Firebase
  // console.log(app)
  return app
}
