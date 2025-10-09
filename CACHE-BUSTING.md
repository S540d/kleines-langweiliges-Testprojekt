# 🔄 Cache Busting & Update Strategy

## Das Problem

Bei Progressive Web Apps (PWAs) gibt es **3 Caching-Ebenen**, die verhindern, dass Nutzer die neueste Version sehen:

1. **Browser Cache** (HTTP Headers)
2. **Service Worker Cache** (PWA Cache)
3. **CDN Cache** (GitHub Pages/Cloudflare)

## Unsere Lösung: Multi-Layer Cache Busting

### 1. 📌 URL Query Parameters (Cache Busting)

**Was:** Versionsnummern in Asset-URLs
**Wie:** `script.js?v=1.3.1`

**In index.html:**
```html
<link rel="stylesheet" href="style.css?v=1.3.1">
<script src="script.js?v=1.3.1"></script>
<script src="firebase-config.js?v=1.3.1"></script>
<script src="auth.js?v=1.3.1"></script>
```

**Vorteil:**
- ✅ Erzwingt neue Downloads bei Version-Änderung
- ✅ Browser behandelt es als neue Datei
- ✅ Umgeht Browser-Cache komplett

### 2. 🔄 Service Worker Update Strategy

**Was:** Aggressives Update-Checking

**Implementiert in index.html:**
- ✅ Update-Check direkt beim Laden
- ✅ Update-Check alle 10 Sekunden
- ✅ Automatische Reload-Notification bei neuer Version
- ✅ `skipWaiting()` für sofortiges Aktivieren

**Code:**
```javascript
// Immediate update check on load
registration.update();

// Check every 10 seconds
setInterval(() => {
    registration.update();
}, 10000);

// Auto-reload prompt when update available
registration.addEventListener('updatefound', () => {
    // Shows confirmation dialog
});
```

**Vorteil:**
- ✅ Erkennt neue Versionen innerhalb von Sekunden
- ✅ Fragt Nutzer ob er aktualisieren will
- ✅ Kein manueller Refresh nötig

### 3. 🗓️ Cache Name mit Datum

**Was:** Service Worker Cache Name enthält Version + Datum

**In service-worker.js:**
```javascript
const CACHE_VERSION = '1.3.1';
const BUILD_DATE = '2025-10-09';
const CACHE_NAME = `eisenhauer-matrix-v${CACHE_VERSION}-${BUILD_DATE}`;
```

**Vorteil:**
- ✅ Jeder Build erstellt neuen Cache
- ✅ Alte Caches werden automatisch gelöscht
- ✅ Keine Konflikte zwischen Versionen

### 4. 🌐 HTTP Headers

**Was:** Cache-Control Headers

**Erstellt in _headers:**
```
/service-worker.js
  Cache-Control: no-cache, no-store, must-revalidate

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.css
  Cache-Control: public, max-age=3600, must-revalidate

/*.js
  Cache-Control: public, max-age=3600, must-revalidate
```

**Hinweis:** GitHub Pages hat **limitierten** Support für custom headers, aber es hilft wo möglich.

**Vorteil:**
- ✅ Minimale Browser-Cache-Zeit
- ✅ Revalidierung bei jedem Zugriff
- ✅ Service Worker wird nie gecached

### 5. 🤖 Automatische Versionierung

**Was:** Build-Script aktualisiert alle Versionen automatisch

**Script:** `update-version.js`

**Aktualisiert:**
- index.html (alle ?v= Parameter)
- service-worker.js (CACHE_VERSION + BUILD_DATE)
- manifest.json (version)

**Usage:**
```bash
# Automatically update all version strings
npm run version:update

# Full deploy preparation
npm run deploy
```

**Vorteil:**
- ✅ Keine manuellen Anpassungen nötig
- ✅ Konsistente Versionsnummern überall
- ✅ Datum wird automatisch gesetzt

## Deployment Workflow

### Bei jedem Update:

```bash
# 1. Bump version in package.json (optional)
npm version patch  # oder minor/major

# 2. Update all version strings
npm run version:update

# 3. Build Firebase config
npm run build

# 4. Commit and push
git add .
git commit -m "chore: release version 1.3.2"
git push origin main

# 5. Deploy to gh-pages
git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main
```

**Oder einfach:**
```bash
npm run deploy
# Follow the instructions
```

## Wie lange dauert das Update?

| Layer | Update-Zeit |
|-------|------------|
| **Service Worker** | ~10 Sekunden (auto-check) |
| **Browser Cache** | Sofort (wegen ?v= Parameter) |
| **CDN Cache** | 1-5 Minuten (GitHub Pages) |

**Realität:** Nutzer sehen Updates innerhalb von **10-30 Sekunden** nach Reload.

## Troubleshooting

### "Ich sehe immer noch die alte Version!"

1. **Hard Refresh:**
   - Chrome/Edge: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
   - Firefox: `Ctrl + F5` / `Cmd + Shift + R`

2. **Service Worker manuell löschen:**
   ```
   Chrome DevTools → Application → Service Workers → Unregister
   Chrome DevTools → Application → Storage → Clear site data
   ```

3. **Warte 30 Sekunden:**
   - Auto-update sollte greifen
   - Refresh die Seite erneut

### "Update-Dialog erscheint nicht"

Der Dialog erscheint nur wenn:
- ✅ Service Worker bereits installiert war
- ✅ Eine neue Version verfügbar ist
- ✅ Nutzer die Seite neu lädt

**Erste Installation:** Kein Dialog, Service Worker wird still installiert.

### "GitHub Pages zeigt alte Version"

GitHub Pages CDN kann **bis zu 10 Minuten** brauchen:
- ⏰ Warte 10 Minuten
- 🔄 Versuche in Incognito/Private Mode
- 🌐 Teste von anderem Gerät

## Best Practices

### ✅ DO:
- Version in package.json aktualisieren
- `npm run version:update` vor jedem Deploy
- Service Worker testen in DevTools
- Hard Refresh zum Testen verwenden

### ❌ DON'T:
- Versionsnummern manuell in Dateien ändern (Script nutzen!)
- Service Worker Cache im Code deaktivieren
- Vergessen `npm run build` zu laufen
- Deploy ohne Version-Update

## Monitoring

### Prüfe ob Update funktioniert:

**Browser Console:**
```javascript
// Check current version
console.log('Version:', APP_VERSION);

// Check cache name
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW Version:', reg.active);
});

// Force update check
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});
```

**Service Worker Status:**
```
Chrome: chrome://serviceworker-internals/
Firefox: about:serviceworkers
```

## Summary

Unser Multi-Layer Ansatz garantiert:
- ✅ Schnelle Updates (10-30 Sekunden)
- ✅ Automatische Benachrichtigung
- ✅ Keine manuellen Anpassungen
- ✅ Konsistente Versionierung

**Einfach `npm run deploy` und fertig!** 🚀
