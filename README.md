# Eisenhauer Matrix - Task Management App

Eine moderne, mobile-first Web-Anwendung zur Aufgabenverwaltung nach der Eisenhauer-Matrix-Methode.

## Features

### 5 Segmente
- **Do!** - Dringend & Wichtig (Sofort erledigen)
- **Schedule!** - Nicht dringend & Wichtig (Planen)
- **Delegate!** - Dringend & Nicht wichtig (Delegieren)
- **Ignore!** - Nicht dringend & Nicht wichtig (Eliminieren)
- **Done!** - Erledigte Aufgaben

### Funktionen
- ✅ Aufgaben mit max. 140 Zeichen erstellen
- ✅ Checkboxen zum Abhaken (verschiebt automatisch zu "Done!")
- ✅ Drag & Drop zwischen Segmenten
- ✅ Move-Button für Segmentwechsel
- ✅ Löschen von Aufgaben
- ✅ **Cloud-Synchronisation** mit Firebase
- ✅ **Benutzer-Accounts** (Google & Apple Sign-In)
- ✅ **Geräte-übergreifende Sync** (Daten auf allen Geräten verfügbar)
- ✅ Offline-Funktionalität (Daten werden lokal gecacht)
- ✅ Mobile-First Design (optimiert für Smartphones)
- ✅ Responsive Layout (funktioniert auch auf Desktop)

## Layout

Die App teilt den Bildschirm in 5 gleich große Segmente (je 20% der Höhe):
- Jedes Segment hat eine scrollbare Aufgabenliste
- Farbcodierung für bessere Übersicht
- Cleanes, modernes Design mit Gradient-Hintergrund

## Verwendung

1. Öffne `index.html` im Browser
2. Neue Aufgabe eingeben und auf "+" klicken
3. Segment auswählen
4. Aufgaben verwalten:
   - **Checkbox anklicken** → Aufgabe wandert zu "Done!"
   - **Drag & Drop** → Aufgabe in anderes Segment ziehen
   - **↔ Button** → Segment-Auswahl öffnen
   - **✕ Button** → Aufgabe löschen

## Technologien

- HTML5
- CSS3 (Flexbox, Grid, Mobile-First)
- Vanilla JavaScript (ES6+)
- **Firebase**
  - Firebase Authentication (Google & Apple Sign-In)
  - Cloud Firestore (Echtzeit-Datenbank)
  - Offline-Persistenz
- **Progressive Web App (PWA)**
  - Service Worker für Offline-Funktionalität
  - Web App Manifest
  - iOS-optimiert

## Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Mobile Browser (iOS Safari, Chrome Mobile)

## Installation

### 1. Firebase Setup (erforderlich für Login)

**Wichtig:** Die App benötigt Firebase für User-Authentifizierung und Cloud-Sync.

1. Folge der detaillierten Anleitung in [FIREBASE-SETUP.md](FIREBASE-SETUP.md)
2. Erstelle ein kostenloses Firebase-Projekt
3. Aktiviere Google & Apple Sign-In
4. Richte Firestore Database ein
5. Kopiere deine Firebase-Config in `firebase-config.js`

⏱️ **Dauer:** ~10 Minuten | 💰 **Kosten:** Kostenlos (Firebase Spark Plan)

### 2. Als Web-App (Browser)

```bash
git clone https://github.com/S540d/kleines-langweiliges-Testprojekt.git
cd kleines-langweiliges-Testprojekt
```

Dann `index.html` im Browser öffnen oder auf GitHub Pages deployen.

### 3. Als iOS App (iPhone/iPad)

Die App kann als Progressive Web App auf iOS installiert werden!

**Schnellstart:**
1. Icons generieren: Öffne `icons/generate-icons.html` und lade alle Icons herunter
2. App auf GitHub Pages hosten (siehe [INSTALL.md](INSTALL.md))
3. Im Safari öffnen → "Teilen" → "Zum Home-Bildschirm"
4. Fertig! Die App läuft wie eine native iOS App

📱 **Detaillierte Anleitung:** Siehe [INSTALL.md](INSTALL.md)

### Features der iOS PWA

- ✅ Vollbild-Modus ohne Browser-UI
- ✅ Eigenes App-Icon auf dem Home-Bildschirm
- ✅ Offline-Funktionalität
- ✅ Wie eine native App verwenden

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.
