# 📋 Publishing Checklist für GitHub Pages PWAs

## Optische Vorgaben
- in allen Projekten soll es unter Settings einen Toggle geben, mit dem man zur Unterseite "Metrik" wechseln kann. dort sind dann typische Zahlen zu erfüllten Todos oder Durchschnittspreisen genannt. je nach Projekt
- minimalistisches Design: Hintergrund in weiß oder schwarz (dark Mode), Diagramme und Textblöcke sind nicht abgesetzt. Diagramme in Ampel:Farblogik (grün gut, rot schlechte). Tasten wenn nötig in Kästchen mit abgerundeten Ecken. 
- responsives Design, das auf kleinen Displays z. B. Die Auflösung des Kalenders reduziert 
- über alle Apps einheitliche Schriftgrösse (noch zu definieren)
- Einstellungen oben Rechts mit **drei vertikalen Punkten (⋮)** als SVG-Icon (NICHT Zahnrad-Emoji); möglichst zusammen mit anderen Symbolen im Header - also nicht zwei Header übereinander: Die Einstellungen stehen dann in folgender Reihenfolge: 
    - App Name, Version oder Datum, Feedback:devsven@posteo.de
    - Wenn relevant: Abgemeldet als...
    - **Theme-Toggle** zwischen "System" (folgt Betriebssystem) und "Dunkel" (immer dunkel) - NICHT Hell/Dunkel/System! Toggle-Switch verwenden, nicht Dropdown.
    - im gleichen Stil: Toogle für deutsch/englisch
    - im gleichen Stil: Toggle zum umschalten auf "Metrik"
    - wenn relevant: Legende(n)
    - Möglichkeit zum Export als JSON, nicht als CSV
    - "SChließen" Taste
    - Lizenz, wenn Daten von Dritten verwendet werden
- bymeacoffee- Link in die Fusszeile der Hauptseite: support me: https://buymeacoffee.com/sven4321 (kaffeetassensymbol + „Support me“ als Link) in gelbem Kasten, Die Fußzeile soll immer sichtbar sein, egal wie gescrollt wird
- **App-Name**: NICHT im Header anzeigen, sondern nur in den Settings-Modal oben als erste Zeile
- **Settings-Modal**: Kompakte Darstellung mit moderaten Abständen zwischen Elementen (nicht zu eng, aber auch nicht zu weit) 
- Es soll - sofern irgendwo ein Icon verwendet wird, jenes sein, das im jeweiligen Projekt unter "icon.png" abgelegt ist
- außer der Teetasse vor dem Footer mit "support me" soll nirgendswo ein Emoji auftauchen. Erst recht nicht in Zusammenhang mit einem Wort
- **Settings-Icon**: Ausschließlich SVG-basierte drei Punkte verwenden (siehe Implementierung in Eisenhauer/index.html)


## 💻 Technische Design-Implementierung

### Settings-Icon (drei Punkte)
```html
<button id="settingsBtn" class="settings-btn" title="Einstellungen">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="2"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <circle cx="12" cy="19" r="2"></circle>
    </svg>
</button>
```

### Theme-Toggle System
- **HTML**: `<input type="checkbox" id="themeToggle" class="toggle-switch">` 
- **Label**: "🌙 System / Dunkel"
- **JavaScript**: 
  - `checked = false` → System-Theme (folgt OS)
  - `checked = true` → Dunkel-Theme (immer dunkel)
- **Persistierung**: LocalStorage mit Key 'theme', Werte: 'system' oder 'dark'

### Settings-Modal Layout
- App-Name als erste Zeile (font-weight: 600)
- Feedback-Email: "📧 Feedback" mit "devsven@posteo.de" darunter
- Kompakte settings-option divs mit 16px margins (nicht 20px+)

## ✅ Essenzielle Dateien

- [ ] **LICENSE** - Open Source Lizenz, Ausschluss von kommerzieller Nutzung
- [ ] **README.md** - Projekt-Dokumentation
- [ ] **.gitignore** - Korrekt konfiguriert (node_modules, dist, etc.) -> keine psswörter, personenbezogene Daten oder nicht-relevanten Notizen
- [ ] **package.json** - Alle Scripts vorhanden (build:web)
- [ ] **app.json** - baseUrl für GitHub Pages konfiguriert


## 🔧 Technische Konfiguration

- [ ] **GitHub Actions Workflow** (.github/workflows/deploy.yml)
- [ ] **PWA Manifest** (public/manifest.json)
- [ ] **Service Worker** (public/service-worker.js)
- [ ] **Icons** (192x192 und 512x512)
- [ ] **Post-Build Script** (scripts/post-build.js)
- [ ] **Dependencies korrekt** (react-dom Version passt)
- [ ] im Zielzustand mit „anmelden mit Google“, „anmelden mit Apple“ und lokal nutzen. Bei letzterem werden die Daten lokal auf dem Gerät gespeichert.
- Einstellungen werden bei Google, Apple oder auf dem Gerät gespeichert. 
- es ist das Freemium Konzept mittelfristig vorgesehen. Dann werden bestimmte Funktionen nur für zahlende Kunden zur Verfügung stehen. Aber in der Anfangsphasen sind alle Funktionen frei zu nutzen
- Einstellungen und Daten können als JSON exportiert werden. Die Einstellung dafür ist im Settings Menu 
- 

## 📝 Code-Qualität

- [ ] **Keine Secrets im Code** (API Keys, Passwörter)
- [ ] **Keine sensiblen Daten** (.env Dateien ignoriert)
- [ ] **Console.logs entfernt** (oder nur für Debug)
- [ ] **TODO-Kommentare bereinigt**
- [ ] **Tote Code-Abschnitte entfernt**
- [ ] **Wenn in einer Datei mehr als 1000 Zeilen code sind, prüfe ob eine Aufteilung sinnvoll ist


## 🌐 GitHub Repository

- [ ] **Repository Public** (für GitHub Pages kostenlos)
- [ ] **Aussagekräftige Description**
- [ ] **Topics/Tags gesetzt**
- [ ] **GitHub Pages aktiviert** (Settings → Pages → GitHub Actions)
- [ ] **Repository-Name = URL-Path** (keine Sonderzeichen)

## 📱 PWA-Spezifisch

- [ ] **Manifest vollständig** (name, icons, start_url, display)
- [ ] **Service Worker registriert** (in index.html)
- [ ] **Icons vorhanden** (mindestens 192x192 und 512x512)
- [ ] **Theme Color definiert**
- [ ] **Offline-Support funktioniert**

## 🎨 Benutzer-Erfahrung

- [ ] **App-Name klar und verständlich**
- [ ] **Beschreibung vorhanden**
- [ ] **Screenshot/Demo im README**
- [ ] **Live-Demo-Link funktioniert**
- [ ] **Mobile-responsive**
- [ ] **Loading-States vorhanden**

## ⚖️ Rechtliches

- [ ] **Lizenz-Datei vorhanden**
- [ ] **Datenquellen-Attribution** (z.B. SMARD.de)
- [ ] **Keine Copyright-Verletzungen**
- [ ] **Datenschutz berücksichtigt** (keine unnötige Datensammlung)
- [ ] **Third-Party-Lizenzen dokumentiert**

## 🔒 Sicherheit

- [ ] **Keine Credentials committed**
- [ ] **Dependencies aktuell** (npm audit)
- [ ] **HTTPS erzwungen** (GitHub Pages macht das automatisch)
- [ ] **XSS-Schutz** (keine innerHTML mit User-Input)
- [ ] **CORS richtig konfiguriert** (falls API-Calls)

## 🚀 Deployment

- [ ] **Build lokal erfolgreich** (npm run build:web)
- [ ] **Keine Build-Errors**
- [ ] **Keine Build-Warnings** (kritische)
- [ ] **Dist-Ordner korrekt** (alle Assets vorhanden)
- [ ] **Relative Pfade** (für Subpath-Deployment)

## 📊 Qualitätssicherung

- [ ] **App läuft lokal** (npm run web)
- [ ] ** App läuft als PWA**
- [ ] **App läuft auf Android** (npm run android) - optional
- [ ] **Grundfunktionen getestet**
- [ ] **Dark Mode funktioniert** (falls implementiert)
- [ ] **Export funktioniert** (falls implementiert)

## 📚 Dokumentation

- [ ] **Installation-Anleitung**
- [ ] **Deployment-Anleitung**
- [ ] **Features dokumentiert**
- [ ] **Known Issues dokumentiert** (falls vorhanden)
- [ ] **Contributing Guide** (optional, aber empfohlen)

## 🎯 Best Practices

- [ ] **Commit-Messages aussagekräftig**
- [ ] **Branch-Strategie** (main = Production)
- [ ] **Semantic Versioning** (in package.json)
- [ ] **Changelog** (optional, aber hilfreich)

## 🔗 Links & Referenzen

- [ ] **GitHub Repository URL** im package.json
- [ ] **Homepage URL** im package.json (GitHub Pages URL)
- [ ] **Bug Tracker URL** (GitHub Issues)
- [ ] **Support-Kontakt** (falls vorhanden)

---

## 📝 Projekt-spezifische Checks

### React Native / Expo Projekte
- [ ] **Expo SDK Version aktuell**
- [ ] **react-native-web installiert**
- [ ] **Platform-specific Code** (Platform.OS checks)

### PWA-spezifisch
- [ ] **Cache-Strategie definiert** (im Service Worker)
- [ ] **Update-Mechanismus** (Service Worker Updates)
- [ ] **Offline-Fallback-Seite**

---

## ⚡ Quick-Check vor Deployment

1. `npm install` - Dependencies installieren
2. `npm run build:web` - Build testen
3. `git status` - Keine uncommitted changes
4. `git log -1` - Letzter Commit aussagekräftig
5. `ls dist/` - Alle Dateien vorhanden
6. GitHub Pages Workflow triggered - Nach Push automatisch

---

**Hinweis:** Diese Checkliste ist ein Leitfaden. Nicht alle Punkte sind für jedes Projekt zwingend erforderlich, aber sie helfen, professionelle und wartbare Projekte zu erstellen.
