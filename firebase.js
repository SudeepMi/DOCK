import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDymyEkz1auYHFpTIowKQhtpp34FRT0YJw",
  authDomain: "dock-b0edb.firebaseapp.com",
  projectId: "dock-b0edb",
  storageBucket: "dock-b0edb.appspot.com",
  messagingSenderId: "788892432689",
  appId: "1:788892432689:web:e44bb30d9b5634f9b15810",
  measurementId: "G-YM0Y4KCTTC"
};

const app = !firebase.apps.length 
                ? firebase.initializeApp(firebaseConfig) 
                : firebase.app();

const db = app.firestore();

export {db};