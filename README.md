# Eisenhauer Matrix - Task Management App

Eine moderne, mobile-first Progressive Web App zur Aufgabenverwaltung nach der Eisenhauer-Matrix-Methode.

🌐 **Live Demo:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/)

## Features

### 5 Segmente
- **Do!** - Dringend & Wichtig (Sofort erledigen)
- **Schedule!** - Nicht dringend & Wichtig (Planen)
- **Delegate!** - Dringend & Nicht wichtig (Delegieren)
- **Ignore!** - Nicht dringend & Nicht wichtig (Eliminieren)
- **Done!** - Erledigte Aufgaben

### Kernfunktionen
- ✅ Aufgaben mit max. 140 Zeichen erstellen
- ✅ **Wiederkehrende Aufgaben** - Automatische Neuerstellung nach Abschluss
  - Täglich, Wöchentlich, Monatlich oder Benutzerdefiniert
  - Flexible Intervall-Konfiguration
- ✅ Automatisches Weiterschieben in nächste Kategorie (↓ Button)
- ✅ Checkboxen zum Abhaken (verschiebt automatisch zu "Done!")
- ✅ Drag & Drop zwischen Segmenten
- ✅ **Swipe-to-Delete** - Tasks durch Wischgeste löschen (Mobile)
- ✅ Löschen von Aufgaben mit Bestätigung

### Cloud & Sync
- ✅ **Cloud-Synchronisation** mit Firebase
- ✅ **Benutzer-Accounts** (Google Sign-In)
- ✅ **Gastmodus** - Ohne Anmeldung testen mit lokalem Speicher
- ✅ **Geräte-übergreifende Sync** (bei Cloud-Login)
- ✅ **Persistente Speicherung** mit IndexedDB (größer & sicherer als localStorage)
- ✅ **Persistent Storage API** verhindert automatisches Löschen durch Browser
- ✅ **Offline-Indikator** zeigt Verbindungsstatus
- ✅ **Pull-to-Refresh** für Datenaktualisierung (Mobile)

### Design & UX
- ✅ **Dark Mode** - Automatisch basierend auf System-Einstellung
- ✅ **Mobile-First Design** - Optimiert für Smartphones
- ✅ **Responsive Layout** - Funktioniert auf Desktop & Tablet
- ✅ **Kompaktes Layout** mit scrollbaren Task-Listen
- ✅ **Progressive Web App (PWA)** - Als App installierbar
- ✅ **iOS-optimiert** mit speziellen Meta-Tags

## Verwendung

### Desktop/Browser
1. Neue Aufgabe eingeben und auf "+" klicken
2. Segment auswählen
3. **Optional:** Wiederkehrende Aufgabe konfigurieren
   - Checkbox "🔁 Als wiederkehrende Aufgabe" aktivieren
   - Intervall auswählen (Täglich, Wöchentlich, Monatlich, Benutzerdefiniert)
   - Bei Wöchentlich: Wochentage auswählen
   - Bei Monatlich: Tag des Monats festlegen (1-31)
   - Bei Benutzerdefiniert: Anzahl Tage angeben
4. Aufgaben verwalten:
   - **Checkbox anklicken** → Aufgabe wandert zu "Done!" (bei wiederkehrenden Aufgaben wird automatisch eine neue erstellt)
   - **Drag & Drop** → Aufgabe in anderes Segment ziehen
   - **↓ Button** → Aufgabe in nächste Kategorie verschieben
   - **✕ Button** → Aufgabe löschen (mit Bestätigung)
   - **🔁 Symbol** → Zeigt an, dass es sich um eine wiederkehrende Aufgabe handelt

### Mobile (Touch)
- **Swipe links** auf Task → Löschen
- **Pull down** auf Task-Liste → Aktualisieren
- **Tap & Hold** → Drag & Drop

## Technologien

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, CSS Variables)
- **JavaScript:** Vanilla ES6+ (kein Framework)
- **Storage:**
  - **IndexedDB** via localForage (Gastmodus - ~50MB+ Speicher)
  - **Persistent Storage API** (verhindert Datenverlust bei Cache-Löschung)
  - Cloud Firestore (für angemeldete User)
- **Backend:** Firebase
  - Firebase Authentication (Google Sign-In)
  - Cloud Firestore (Echtzeit-Datenbank mit Security Rules)
  - Offline-Persistenz
- **PWA Features:**
  - Service Worker für Offline-Funktionalität
  - Web App Manifest
  - iOS Web App Capable

## Installation

### 1. Firebase Setup (erforderlich für Login)

**Wichtig:** Die App benötigt Firebase für User-Authentifizierung und Cloud-Sync.

1. Folge der detaillierten Anleitung in [FIREBASE-SETUP.md](FIREBASE-SETUP.md)
2. Erstelle ein kostenloses Firebase-Projekt
3. Aktiviere Google & Apple Sign-In
4. Richte Firestore Database ein
5. Kopiere deine Firebase-Config in `firebase-config.js`

⏱️ **Dauer:** ~10 Minuten | 💰 **Kosten:** Kostenlos (Firebase Spark Plan)

### 2. Lokale Entwicklung

```bash
git clone https://github.com/S540d/kleines-langweiliges-Testprojekt.git
cd kleines-langweiliges-Testprojekt
```

Dann `index.html` im Browser öffnen oder lokalen Server starten:
```bash
python3 -m http.server 8000
# Oder
npx http-server
```

### 3. Als iOS App installieren

Die App kann als Progressive Web App auf iOS installiert werden!

1. Icons generieren: Öffne `icons/generate-icons.html` und lade alle Icons herunter
2. App auf GitHub Pages hosten (siehe [INSTALL.md](INSTALL.md))
3. Im Safari öffnen → "Teilen" → "Zum Home-Bildschirm"
4. Fertig! Die App läuft wie eine native iOS App

📱 **Detaillierte Anleitung:** Siehe [INSTALL.md](INSTALL.md)

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## Datenspeicherung

### Gastmodus (ohne Anmeldung)
- **Speicherort:** IndexedDB (über localForage)
- **Kapazität:** ~50MB+ (viel größer als localStorage)
- **Persistenz:** Persistent Storage API verhindert automatisches Löschen
- **Synchronisation:** Nur auf diesem Gerät verfügbar
- **Sicherheit:** Lokal gespeichert, Same-Origin-Policy geschützt

### Cloud-Modus (mit Anmeldung)
- **Speicherort:** Firebase Cloud Firestore
- **Synchronisation:** Automatisch auf allen Geräten
- **Sicherheit:**
  - Firebase Security Rules mit strikter Validierung
  - XSS-Schutz durch konsequente Verwendung von `textContent`
  - Authentifizierung erforderlich
  - User können nur eigene Daten lesen/schreiben
  - Input-Validierung (max. 140 Zeichen, nur erlaubte Segmente)

## Roadmap

Geplante Features (siehe [Issues](https://github.com/S540d/Eisenhauer/issues)):

- [ ] Archiv für gelöschte Tasks
- [ ] Weitere Authentifizierungs-Anbieter
- [ ] Export/Import von Tasks
- [ ] Kategorien/Tags
- [ ] Fälligkeitsdaten
- [ ] Erinnerungen/Benachrichtigungen

## Lizenz

Dieses Projekt steht unter der Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

**Das bedeutet:**
- ✅ Du darfst das Projekt nutzen, kopieren und modifizieren
- ✅ Du darfst es für private/persönliche Zwecke verwenden
- ❌ Kommerzielle Nutzung ist **nicht** erlaubt
- ℹ️ Bei Verwendung muss der Urheber genannt werden

Siehe [LICENSE](LICENSE) für Details.

## Mitwirken

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue öffnen.

## Kontakt

Bei Fragen oder Feedback: [GitHub Issues](https://github.com/S540d/Eisenhauer/issues)

---

Made with ❤️ and [Claude Code](https://claude.com/claude-code)
