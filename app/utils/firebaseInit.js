import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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
  return app
}
