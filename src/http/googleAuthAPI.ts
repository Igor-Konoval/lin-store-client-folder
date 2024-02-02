import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import {AxiosResponse} from "axios";

export interface IGoogleAuth {
    username: string,
    email: string,
    verifiedEmail: boolean,
    uid: string,
}

firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_IP,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

export const googleAuth = async (): Promise<AxiosResponse<IGoogleAuth>> => {
    const auth = getAuth();

    try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const user = result.user;

        const data: IGoogleAuth = {
            username: user.displayName || "",
            email: user.email || "",
            verifiedEmail: user.emailVerified || false,
            uid: user.uid,
        };

        return data;
    } catch (error) {
        console.error("Помилка авторизації Google:", error);
        throw error;
    }
};

