// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;