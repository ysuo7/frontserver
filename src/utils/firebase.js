import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCu93N1kHDUDHYx_ttxRK-c43q65M1BJB0",
    authDomain: "bookstore-250d8.firebaseapp.com",
    projectId: "bookstore-250d8",
    storageBucket: "bookstore-250d8.appspot.com",
    messagingSenderId: "610627010461",
    appId: "1:610627010461:web:1476a2890c28565e9ef974",
    measurementId: "G-0F54N2VZHG"
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;