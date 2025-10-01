# iOS Installation Guide

## Progressive Web App (PWA) Installation auf iOS

Die Eisenhauer Matrix App kann als Progressive Web App direkt auf deinem iPhone/iPad installiert werden - ohne App Store!

### Voraussetzungen
- iPhone/iPad mit iOS 11.3 oder höher
- Safari Browser

### Icons generieren

Bevor du die App auf iOS installierst, musst du die App-Icons generieren:

1. Öffne die Datei `icons/generate-icons.html` im Browser
2. Klicke auf "Generate Icons"
3. Lade alle generierten Icons herunter (8 Dateien)
4. Speichere sie im `icons/` Verzeichnis

**Icon-Größen:**
- 72x72 px
- 96x96 px
- 128x128 px
- 144x144 px
- 152x152 px
- 192x192 px
- 384x384 px
- 512x512 px

### Installation auf iOS

1. **App hosten:**
   - Lade alle Dateien auf einen Webserver hoch (z.B. GitHub Pages, Netlify, Vercel)
   - ODER nutze einen lokalen Server für Tests:
     ```bash
     cd kleines-langweiliges-Testprojekt
     python3 -m http.server 8000
     # Dann im iPhone-Safari: http://[deine-ip]:8000
     ```

2. **Öffne die App in Safari:**
   - Öffne Safari auf dem iPhone
   - Navigiere zur URL deiner App

3. **Zum Home-Bildschirm hinzufügen:**
   - Tippe auf das "Teilen"-Symbol (□ mit Pfeil nach oben)
   - Scrolle runter und wähle "Zum Home-Bildschirm"
   - Benenne die App (Standard: "Eisenhauer")
   - Tippe auf "Hinzufügen"

4. **App starten:**
   - Die App erscheint jetzt als Icon auf deinem Home-Bildschirm
   - Öffne sie wie jede andere App
   - Sie läuft im Vollbild-Modus ohne Browser-UI

### Features der iOS PWA

✅ **Funktioniert wie eine native App:**
- Vollbild-Modus (keine Safari-Leiste)
- Eigenes App-Icon auf dem Home-Bildschirm
- Erscheint im App-Switcher

✅ **Offline-Funktionalität:**
- Dank Service Worker läuft die App auch ohne Internet
- Daten werden lokal im Browser gespeichert (LocalStorage)

✅ **Automatische Updates:**
- Bei erneutem Öffnen wird die neueste Version geladen
- Keine manuelle Installation nötig

### GitHub Pages Deployment (Empfohlen)

So hostest du die App kostenlos auf GitHub Pages:

1. **Repository Settings öffnen:**
   - Gehe zu: https://github.com/S540d/kleines-langweiliges-Testprojekt
   - Klicke auf "Settings"

2. **GitHub Pages aktivieren:**
   - Navigiere zu "Pages" (linkes Menü)
   - Bei "Source": Wähle "main" Branch
   - Klicke "Save"

3. **Warte auf Deployment:**
   - Nach ca. 1-2 Minuten ist die App verfügbar unter:
   - `https://s540d.github.io/kleines-langweiliges-Testprojekt/`

4. **Diese URL auf dem iPhone öffnen und installieren!**

### Troubleshooting

**Problem: Icons werden nicht angezeigt**
- Stelle sicher, dass alle Icon-Dateien im `icons/` Ordner liegen
- Überprüfe die Dateigröße (sollte nicht 0 KB sein)
- Lösche die App vom Home-Bildschirm und installiere sie erneut

**Problem: App funktioniert nicht offline**
- Service Worker benötigt HTTPS (außer bei localhost)
- Bei GitHub Pages ist HTTPS automatisch aktiviert

**Problem: App öffnet sich in Safari**
- Stelle sicher, dass du die App vom Home-Bildschirm öffnest
- NICHT über einen Safari-Lesezeichen

**Problem: Daten gehen verloren**
- iOS kann LocalStorage löschen, wenn Speicherplatz knapp wird
- Für wichtige Daten: Exportfunktion in der App implementieren (zukünftiges Feature)

### Alternative: Testflight / App Store

Wenn du die App im App Store veröffentlichen möchtest:
1. Swift/SwiftUI App mit WKWebView erstellen
2. Xcode Projekt anlegen
3. Apple Developer Account ($99/Jahr)
4. App Store Review Prozess

Dies ist deutlich aufwändiger als die PWA-Lösung!
