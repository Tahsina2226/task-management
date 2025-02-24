import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAo13mDDIcOCG56mswAJtP31gHcEYMV0cw",
    authDomain: "task-app-3d1ce.firebaseapp.com",
    projectId: "task-app-3d1ce",
    storageBucket: "task-app-3d1ce.appspot.com", // Fixed incorrect storage bucket URL
    messagingSenderId: "700128385892",
    appId: "1:700128385892:web:6c40d8e28fe2cf6b183871"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };