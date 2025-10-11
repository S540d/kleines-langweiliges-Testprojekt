# 🧹 Daily Cleanup Workflow

## Übersicht

Am Ende eines Arbeitstages kannst du einfach sagen **"und jetzt aufräumen"** oder `/aufräumen` eingeben, und alles wird automatisch geprüft und aufgeräumt.

---

## 🎯 3 Möglichkeiten zum Aufräumen

### Option 1: Slash Command (Empfohlen!)

Einfach in Claude Code eingeben:

```
/aufräumen
```

oder auf Englisch:

```
/cleanup
```

**Was passiert:**
- Claude führt alle 11 Cleanup-Schritte interaktiv durch
- Du wirst bei wichtigen Entscheidungen gefragt
- **Automatischer Deploy auf Testing-URL** für Partner-Tests
- Am Ende bekommst du eine Zusammenfassung

---

### Option 2: Automatisches Script

Führe das Script direkt aus:

```bash
./.github/scripts/daily-cleanup.sh
```

**Was das Script macht:**

1. **Repository Status** 📊
   - Prüft uncommitted changes
   - Zeigt aktuelle Branch-Info
   - Sync-Status mit origin

2. **Branch Cleanup** 🌿
   - Listet merged Feature Branches
   - Fragt ob gelöscht werden soll
   - Räumt lokal und remote auf

3. **Testing Environment** 🧪
   - Prüft ob testing mit main synchron
   - Bietet Synchronisation an
   - Zeigt Deploy Status

4. **GitHub Actions** 🤖
   - Zeigt letzte Workflow Runs
   - Warnt bei Failed Runs
   - Status für Production + Testing

5. **Pull Requests** 🔀
   - Listet offene PRs
   - Zeigt Status (Approved? Mergeable?)
   - Warnt bei alten PRs (>7 Tage)

6. **Issues Management** 📋
   - Listet Prio Issues
   - Zeigt heute geschlossene Issues
   - Warnt bei Issues ohne Label

7. **Dependencies & Security** 🔒
   - Prüft outdated packages
   - Führt npm audit aus
   - Warnt bei Vulnerabilities

8. **Sync & Push** 🔄
   - Pusht lokale Commits
   - Holt neueste Änderungen
   - Zeigt Status

9. **Testing Deploy** 🧪 **← NEU!**
   - Synchronisiert testing Branch mit main
   - Pusht testing Branch automatisch
   - Triggert GitHub Action Deploy
   - Deployed auf: https://s540d.github.io/Eisenhauer-testing/
   - Wartet auf Deploy-Status (10 Sekunden)
   - **Partner kann direkt testen!**

10. **Backup Reminder** 💾
    - Erinnert an JSON Export
    - Zeigt letztes Backup Datum
    - Warnt wenn >7 Tage alt

11. **Zusammenfassung** 📊
    - Anzahl gelöschter Branches
    - Anzahl gepushter Commits
    - Testing Deploy Status
    - Warnings
    - Nächste TODOs

---

### Option 3: Manuell mit Claude

Sage einfach:

```
"und jetzt aufräumen"
"Zeit für Tagesabschluss"
"cleanup bitte"
```

Claude wird dann den `/aufräumen` Command ausführen.

---

## 🎨 Script Output Beispiel

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🧹 EISENHAUER DAILY CLEANUP 🧹                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 1. Repository Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Working tree clean
📍 Current branch: main
✅ Branch is up to date with origin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 2. Branch Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lokale Feature Branches:
  ✓ feature/test-workflow (merged)
  ○ feature/work-in-progress (not merged)

Merged Branches löschen? (y/n) y
✅ 1 Branches gelöscht

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 9. Testing Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Synchronisiere testing Branch mit main...
✅ Testing Branch mit main synchronisiert

Pushe testing Branch → Triggert automatisches Deploy...
✅ Testing Deploy triggered!
📍 Testing URL: https://s540d.github.io/Eisenhauer-testing/

Warte auf Deploy-Start (10 Sekunden)...
Testing Deploy Status:
  Status: in_progress
⏳ Deploy läuft... Prüfe Status mit: gh run watch

...

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              ✨ CLEANUP ABGESCHLOSSEN ✨                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## ⏱️ Beste Zeit für Cleanup

Führe den Cleanup aus:

- ✅ **Ende des Arbeitstages** - Bevor du den Computer schließt
- ✅ **Vor dem Wochenende** - Freitag Nachmittag
- ✅ **Nach größeren Merges** - Nach Abschluss eines Features
- ✅ **Vor wichtigen Releases** - Aufräumen vor Production Deploy

---

## 🔄 Häufigkeit

**Empfohlen:**
- **Täglich:** Wenn du aktiv entwickelst
- **Wöchentlich:** Bei gelegentlicher Entwicklung
- **Nach jedem Feature:** Wenn Feature abgeschlossen und gemerged

---

## 🛡️ Sicherheit

Das Cleanup Script ist **sicher**:

✅ Fragt bei wichtigen Aktionen nach (Branches löschen, etc.)
✅ Löscht nur merged Branches
✅ Macht keine Force Pushes
✅ Erstellt keine automatischen Commits ohne Bestätigung
✅ Kann jederzeit mit Ctrl+C abgebrochen werden

---

## 📋 Checkliste für manuelles Cleanup

Falls du es manuell ohne Script machen willst:

### Git & Branches
- [ ] Git status prüfen
- [ ] Uncommitted changes committen
- [ ] Merged Branches löschen (lokal & remote)
- [ ] Testing Branch mit main synchronisieren
- [ ] Alle lokalen Commits pushen

### GitHub
- [ ] GitHub Actions Status prüfen
- [ ] Offene Pull Requests reviewen
- [ ] Prio Issues prüfen
- [ ] Heute geschlossene Issues kontrollieren

### Wartung
- [ ] npm outdated prüfen
- [ ] npm audit ausführen
- [ ] Backup erstellen (falls >7 Tage her)

### Dokumentation
- [ ] README bei Bedarf aktualisieren
- [ ] CHANGELOG bei Bedarf aktualisieren
- [ ] TODOs für morgen notieren

---

## 🚀 Quick Start

**Erstmaliges Setup:**
```bash
# Script ist bereits erstellt und executable
# Slash Commands sind bereits konfiguriert
# Einfach loslegen!
```

**Tägliche Nutzung:**
```bash
# Option A: Slash Command in Claude Code
/aufräumen

# Option B: Script direkt
./.github/scripts/daily-cleanup.sh

# Option C: Einfach sagen
"und jetzt aufräumen"
```

---

## 💡 Tipps

### Zeitsparend
- Lass das Script während der Mittagspause laufen
- Kombiniere mit Commit aller Änderungen
- Nutze die Zusammenfassung für Status-Updates

### Best Practices
- Räume NACH dem Mergen von PRs auf
- Synchronisiere testing Branch regelmäßig
- Achte auf Security Warnings
- Backup nicht vergessen!

### Automatisierung
- Erstelle einen Cronjob für Freitag 17:00
- Kombiniere mit git hooks
- Nutze als pre-weekend routine

---

## 🔧 Anpassungen

Das Script kannst du anpassen in:
```bash
.github/scripts/daily-cleanup.sh
```

Die Slash Commands kannst du anpassen in:
```bash
.claude/commands/aufräumen.md
.claude/commands/cleanup.md
```

---

## 🆘 Troubleshooting

### "Script findet gh nicht"
→ Installiere GitHub CLI: https://cli.github.com/

### "Permission denied"
→ Führe aus: `chmod +x ./.github/scripts/daily-cleanup.sh`

### "Slash Command wird nicht erkannt"
→ Claude Code neu starten oder `.claude/commands/` Verzeichnis prüfen

### "Script hängt"
→ Drücke Ctrl+C zum Abbrechen

---

## 📖 Siehe auch

- [TESTING-WORKFLOW.md](TESTING-WORKFLOW.md) - Testing Workflow Dokumentation
- [README.md](README.md) - Projekt Übersicht
- [.github/scripts/](../../.github/scripts/) - Alle Automation Scripts

---

**Viel Erfolg mit dem täglichen Cleanup!** 🎉

*Pro-Tipp: Mach dir einen Reminder um 17:00 für `/aufräumen`* ⏰
