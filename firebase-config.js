// Firebase Configuration
// WICHTIG: Ersetze diese Werte mit deinen eigenen Firebase-Projektwerten
// Siehe FIREBASE-SETUP.md für Anleitung

const firebaseConfig = {
    apiKey: "AIzaSyDVZh7wLZeFXpoxIqwKFtC8KsYj9zF6lBM",
    authDomain: "eisenhauer-matrix.firebaseapp.com",
    projectId: "eisenhauer-matrix",
    storageBucket: "eisenhauer-matrix.firebasestorage.app",
    messagingSenderId: "174175941071",
    appId: "1:174175941071:web:80d5a25ed700b99809e2ba",
    measurementId: "G-VY3618D2RT"
};

// Prüfen ob Firebase SDK geladen wurde
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded!');
} else {
    console.log('Firebase SDK loaded successfully');
}

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized');

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
