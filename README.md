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
- ✅ LocalStorage-Persistenz (Daten bleiben nach Neuladen erhalten)
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
- LocalStorage API
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

### Als Web-App (Browser)

Keine Installation erforderlich - einfach die Dateien öffnen:

```bash
git clone https://github.com/S540d/kleines-langweiliges-Testprojekt.git
cd kleines-langweiliges-Testprojekt
```

Dann `index.html` im Browser öffnen.

### Als iOS App (iPhone/iPad)

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
