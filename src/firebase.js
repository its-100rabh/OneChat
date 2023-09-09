import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB0lGLdSfsxsOX-9U3j3Q-sOSXcFpeGSms",
    authDomain: "onechat-86740.firebaseapp.com",
    projectId: "onechat-86740",
    storageBucket: "onechat-86740.appspot.com",
    messagingSenderId: "240174660697",
    appId: "1:240174660697:web:77c29e0596afef976c8548",
    measurementId: "G-2BN3CM05TR"

};



initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();