// Firebase Configuration
// This file is INTENTIONALLY committed to the repository
//
// ⚠️ IMPORTANT SECURITY NOTE:
// These Firebase credentials are PUBLIC and safe to commit!
//
// Firebase web API keys are designed to be public (client-side keys).
// They are NOT secret keys and should be included in your client code.
//
// Your app's security is PROTECTED through:
// 1. ✅ Firebase Security Rules (Firestore/Storage/Database)
//    → Only authenticated users can read/write their own data
// 2. ✅ Authorized domains in Firebase Console
//    → Only whitelisted domains can use these credentials
// 3. ✅ Firebase App Check (optional additional protection)
//    → Prevents abuse from unauthorized apps
//
// These client-side keys ONLY identify your Firebase project.
// All security is enforced server-side through Firebase Security Rules.
//
// 📖 Learn more: https://firebase.google.com/docs/projects/api-keys
// 🔒 Security Rules: https://firebase.google.com/docs/rules

const firebaseConfig = {
    apiKey: "AIzaSyCV10ZrEZCd314UrpMKixQ98uOKHChSYPU",
    authDomain: "eisenhauer-matrix.firebaseapp.com",
    projectId: "eisenhauer-matrix",
    storageBucket: "eisenhauer-matrix.firebasestorage.app",
    messagingSenderId: "174175941071",
    appId: "1:174175941071:web:b7f9da773b12266009e2ba",
    measurementId: "G-XS1SF0G6K5"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

const appleProvider = new firebase.auth.OAuthProvider('apple.com');

// Optional: Offline-Persistenz aktivieren
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });
