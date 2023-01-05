// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCaezxtJgBaUvgEPFgmpsvESGNj1Tb-L_A",
    authDomain: "dkp-marketplace.firebaseapp.com",
    projectId: "dkp-marketplace",
    storageBucket: "dkp-marketplace.appspot.com",
    messagingSenderId: "566924952670",
    appId: "1:566924952670:web:a341d952d97c1ef4bfe0cf",
    measurementId: "G-TKRL45X9LP"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();

export const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const firestore = getFirestore(firebaseApp);
export default firebaseApp;