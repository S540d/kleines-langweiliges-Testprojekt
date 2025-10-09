# Firebase Setup Anleitung

Diese Anleitung zeigt dir, wie du Firebase Authentication und Firestore für die Eisenhauer Matrix App einrichtest.

## Schritt 1: Firebase-Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Projektname eingeben: `eisenhauer-matrix` (oder einen eigenen Namen)
4. Google Analytics kannst du optional aktivieren
5. Klicke auf "Projekt erstellen"

## Schritt 2: Web-App hinzufügen

1. In der Firebase Console, klicke auf das **Web-Icon** (</>) um eine Web-App hinzuzufügen
2. App-Spitzname: `Eisenhauer Matrix Web`
3. **NICHT** "Firebase Hosting einrichten" aktivieren (wir nutzen GitHub Pages)
4. Klicke auf "App registrieren"

## Schritt 3: Firebase-Konfiguration kopieren

Du bekommst jetzt einen Code-Schnipsel wie diesen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "eisenhauer-matrix-xxxxx.firebaseapp.com",
  projectId: "eisenhauer-matrix-xxxxx",
  storageBucket: "eisenhauer-matrix-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

**Erstelle deine persönliche Konfigurationsdatei:**

1. Kopiere die Datei `firebase-config.example.js` zu `firebase-config.js`:
   ```bash
   cp firebase-config.example.js firebase-config.js
   ```

2. Öffne `firebase-config.js` und ersetze die Platzhalter mit deinen echten Werten von Firebase:

```javascript
const firebaseConfig = {
    apiKey: "DEIN_API_KEY_HIER",  // z.B. "AIzaSyXXXXXXXXXXXXXXXX..."
    authDomain: "DEIN_PROJECT_ID.firebaseapp.com",
    projectId: "DEIN_PROJECT_ID",
    storageBucket: "DEIN_PROJECT_ID.appspot.com",
    messagingSenderId: "DEINE_SENDER_ID",
    appId: "DEINE_APP_ID"
};
```

**Wichtig:** Die Datei `firebase-config.js` ist bereits in `.gitignore` und wird niemals zu Git committed. Deine Credentials bleiben privat!

## Schritt 4: Google Sign-In aktivieren

1. In Firebase Console, gehe zu **Authentication** (linkes Menü)
2. Klicke auf **Get started** (wenn noch nicht aktiviert)
3. Gehe zum Tab **Sign-in method**
4. Klicke auf **Google** und aktiviere es
5. **Projekt-Support-E-Mail** auswählen
6. Klicke auf **Speichern**

## Schritt 5: Apple Sign-In aktivieren

1. Im gleichen **Sign-in method** Tab
2. Klicke auf **Apple** und aktiviere es
3. Für Apple Sign-In benötigst du:
   - **Apple Developer Account** (99$/Jahr)
   - **Service ID** von Apple Developer Portal

### Apple Sign-In Details (Optional - kann später hinzugefügt werden):

**Wenn du keinen Apple Developer Account hast:**
- Deaktiviere Apple Sign-In vorläufig
- Kommentiere in `index.html` den Apple-Button aus:
  ```html
  <!-- <button onclick="signInWithApple()" class="login-btn apple-btn">
      ...Apple Sign-In Button...
  </button> -->
  ```

**Wenn du Apple Developer Account hast:**
1. Gehe zu [Apple Developer Portal](https://developer.apple.com/account/)
2. Erstelle eine **Service ID** für deine App
3. Konfiguriere die **Return URLs** (z.B. `https://eisenhauer-matrix-xxxxx.firebaseapp.com/__/auth/handler`)
4. Trage die **Service ID** in Firebase ein

## Schritt 6: Firestore Database einrichten

1. In Firebase Console, gehe zu **Firestore Database** (linkes Menü)
2. Klicke auf **Datenbank erstellen**
3. Wähle **Produktionsmodus** (wir setzen eigene Regeln)
4. Wähle eine Region (z.B. `europe-west3 (Frankfurt)`)
5. Klicke auf **Aktivieren**

## Schritt 7: Firestore Security Rules

1. Gehe zum Tab **Regeln** in Firestore
2. Ersetze die Regeln mit folgendem Code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users können nur ihre eigenen Daten lesen/schreiben
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Klicke auf **Veröffentlichen**

## Schritt 8: Autorisierte Domains hinzufügen

1. Gehe zu **Authentication** > **Settings** > **Authorized domains**
2. Füge deine GitHub Pages URL hinzu:
   - `s540d.github.io`
3. Klicke auf **Hinzufügen**

## Schritt 9: App testen

1. Öffne die App lokal oder auf GitHub Pages
2. Klicke auf "Mit Google anmelden"
3. Wähle dein Google-Konto
4. Die App sollte dich einloggen und deine Aufgaben synchronisieren!

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Stelle sicher, dass die Firebase-Config korrekt in `firebase-config.js` eingetragen ist
- Überprüfe, dass die Firebase SDK Scripts vor `firebase-config.js` geladen werden

### Error: "auth/unauthorized-domain"
- Füge deine Domain zu den autorisierten Domains hinzu (siehe Schritt 8)
- Für lokale Tests: `localhost` sollte automatisch autorisiert sein

### Apple Sign-In funktioniert nicht
- Stelle sicher, dass du einen Apple Developer Account hast
- Überprüfe die Service ID und Return URLs in Apple Developer Portal
- Alternativ: Deaktiviere Apple Sign-In vorläufig

### Daten werden nicht synchronisiert
- Überprüfe die Firestore Security Rules (Schritt 7)
- Öffne die Browser-Konsole und prüfe auf Fehler
- Stelle sicher, dass du eingeloggt bist

## Kosten

**Firebase Free Tier (Spark Plan):**
- ✅ Authentication: 10.000 aktive User/Monat kostenlos
- ✅ Firestore: 50.000 Lese-/20.000 Schreib-Operationen pro Tag
- ✅ 1 GB Speicher

Für kleine persönliche Apps ist Firebase **komplett kostenlos**!

## Nächste Schritte

Nach erfolgreicher Einrichtung:
1. Die Datei `firebase-config.js` ist bereits in `.gitignore` und wird **NICHT** zu Git committed
2. Deploye die App auf GitHub Pages
3. Teste Login auf dem iPhone/iPad
4. Genieße die Cloud-Synchronisation! 🎉

## Support

Bei Problemen:
- [Firebase Dokumentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- GitHub Issues in diesem Repository
