// Firebase Configuration
// WICHTIG: Ersetze diese Werte mit deinen eigenen Firebase-Projektwerten
// Siehe FIREBASE-SETUP.md für Anleitung

  const firebaseConfig = {
    apiKey: "AIzaSyADQiN-B5oo-JFssHGVzHYnCd6SDHRBgA0",
    authDomain: "eisenhauer-b18d7.firebaseapp.com",
    projectId: "eisenhauer-b18d7",
    storageBucket: "eisenhauer-b18d7.firebasestorage.app",
    messagingSenderId: "665514608611",
    appId: "1:665514608611:web:8a44707c5dc2d6276e42d6",
 //   measurementId: "G-CRW8LEWZHL"
  };

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
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
