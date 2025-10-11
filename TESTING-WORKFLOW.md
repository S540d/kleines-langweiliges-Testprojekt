# 🧪 Testing Workflow für Eisenhauer (Issue #74)

## Übersicht

Dieser Workflow verhindert, dass ungeteStete Änderungen direkt in Production gelangen.
**Alles ist automatisiert** - es kann kaum etwas schiefgehen!

## 🎯 Ziel

- ✅ Kein automatischer Deploy auf Production (`gh-pages`)
- ✅ Testing Environment für Partner-Tests
- ✅ Pull Requests müssen approved werden
- ✅ Maximale Automatisierung

---

## 📊 Workflow-Diagramm

```
Feature Branch (Sven)
    ↓
    ↓ Pull Request erstellen
    ↓
main (Protected)
    ↓
    ↓ Merge → testing
    ↓
testing Branch
    ↓
    ↓ Automatischer Deploy (GitHub Action)
    ↓
gh-pages-testing
    ↓
    ↓ Partner testet auf https://s540d.github.io/Eisenhauer-testing/
    ↓
    ↓ Partner approved PR
    ↓
main (Merge)
    ↓
    ↓ Automatischer Deploy (GitHub Action)
    ↓
gh-pages (Production)
    ↓
    ↓ Live auf https://s540d.github.io/Eisenhauer/
```

---

## 🚀 Einmalige Einrichtung

### 1. Branch Protection aktivieren

```bash
cd /Users/svenstrohkark/Documents/Programmierung/Projects/Eisenhauer
./.github/scripts/setup-branch-protection.sh
```

**Das Script macht automatisch:**
- ✅ Require 1 approval für PR
- ✅ Force Push blockiert
- ✅ Branch Deletion blockiert
- ✅ Conversation Resolution erforderlich

### 2. Testing Branch erstellen

```bash
# Im Eisenhauer Repository
git checkout main
git pull origin main
git checkout -b testing
git push -u origin testing
```

### 3. GitHub Pages Testing Environment konfigurieren

1. Gehe zu: `https://github.com/S540d/Eisenhauer/settings/pages`
2. Klicke auf "Add another branch"
3. Wähle Branch: `gh-pages-testing`
4. Speichern

**Fertig!** 🎉

---

## 👨‍💻 Täglicher Workflow (Sven)

### Schritt 1: Feature entwickeln

```bash
# Neuen Feature Branch erstellen
git checkout main
git pull origin main
git checkout -b feature/mein-neues-feature

# ... Code schreiben ...

# Committen
git add .
git commit -m "feat: Meine neue Funktion"
git push -u origin feature/mein-neues-feature
```

### Schritt 2: Pull Request erstellen

```bash
# Automatisch mit gh CLI
gh pr create --base main --title "feat: Meine neue Funktion" --fill
```

**Oder manuell:**
1. Gehe zu GitHub
2. "Create Pull Request"
3. Template wird automatisch geladen ✅

### Schritt 3: In Testing Branch mergen (für Partner-Test)

```bash
# Testing Branch aktualisieren
git checkout testing
git pull origin testing
git merge feature/mein-neues-feature
git push origin testing
```

**Automatisch passiert:**
- ✅ GitHub Action startet
- ✅ Build wird erstellt
- ✅ Deploy auf `gh-pages-testing`
- ✅ Verfügbar unter: https://s540d.github.io/Eisenhauer-testing/

### Schritt 4: Partner informieren

```bash
# Partner-Nachricht (automatisch)
echo "🧪 Testing Version bereit!"
echo "URL: https://s540d.github.io/Eisenhauer-testing/"
echo "PR: https://github.com/S540d/Eisenhauer/pulls"
```

---

## 👥 Partner Workflow

### Schritt 1: Lokaler Test (Optional aber empfohlen)

```bash
# Branch auschecken
git fetch origin
git checkout feature/mein-neues-feature

# Lokal starten
npm start
# → http://localhost:8000
```

**Prüfen:**
- ✅ Funktionalität
- ✅ Keine Console Errors
- ✅ UI/UX
- ✅ Mobile Ansicht

### Schritt 2: Online Testing

1. Öffne: https://s540d.github.io/Eisenhauer-testing/
2. Teste alle Features
3. Prüfe auf verschiedenen Geräten

**Checkliste im PR Template:**
- [ ] Funktionalität arbeitet wie erwartet
- [ ] Keine Console Errors
- [ ] UI/UX ist stimmig
- [ ] Mobile Ansicht funktioniert
- [ ] PWA Features funktionieren
- [ ] Performance ist gut
- [ ] Service Worker funktioniert
- [ ] Cache wird korrekt aktualisiert

### Schritt 3: Review & Approval

1. Gehe zum Pull Request auf GitHub
2. "Review changes"
3. **Approve** wenn alles gut ist
4. Oder: "Request changes" mit Kommentaren

**Wichtig:** Ohne Approval kann nicht gemerged werden! ✅

---

## 🔄 Production Deploy

### Nach Partner Approval

```bash
# Zurück zu Svens Computer
git checkout main
git pull origin main

# PR mergen (auf GitHub oder via CLI)
gh pr merge <PR-Nummer> --squash --delete-branch
```

**Automatisch passiert:**
- ✅ GitHub Action startet
- ✅ Production Build
- ✅ Deploy auf `gh-pages`
- ✅ Live unter: https://s540d.github.io/Eisenhauer/

---

## 🛡️ Sicherheiten / Was kann NICHT schiefgehen

### Branch Protection verhindert:
- ❌ Direkter Push auf `main` ohne PR
- ❌ Merge ohne Partner Approval
- ❌ Force Push auf `main`
- ❌ Löschen des `main` Branch

### Automatisierung stellt sicher:
- ✅ Testing Deploy ist getrennt von Production
- ✅ Kein manueller Deploy nötig
- ✅ Konsistente Build-Prozesse
- ✅ PR Template mit Checkliste

### Fail-Safes:
- ✅ Testing URL ist deutlich anders
- ✅ Testing Marker im HTML (`data-environment="testing"`)
- ✅ Separate GitHub Pages Branches
- ✅ Commit Messages zeigen Environment

---

## 🔍 Monitoring & Debugging

### GitHub Actions prüfen

```bash
# Liste letzte Workflow Runs
gh run list --workflow=deploy.yml --limit 5
gh run list --workflow=deploy-testing.yml --limit 5

# Details zu einem Run
gh run view <RUN-ID>

# Logs anzeigen
gh run view <RUN-ID> --log
```

### Testing Environment prüfen

```bash
# Welcher Commit ist deployed?
gh api /repos/S540d/Eisenhauer/git/refs/heads/gh-pages-testing | jq -r '.object.sha'

# Letzter Commit auf testing Branch
git log testing -1 --oneline
```

### Production Environment prüfen

```bash
# Welcher Commit ist deployed?
gh api /repos/S540d/Eisenhauer/git/refs/heads/gh-pages | jq -r '.object.sha'

# Letzter Commit auf main Branch
git log main -1 --oneline
```

---

## 🆘 Troubleshooting

### Problem: Testing Deploy schlägt fehl

```bash
# Prüfe Workflow Logs
gh run list --workflow=deploy-testing.yml
gh run view <FAILED-RUN-ID> --log

# Häufige Ursachen:
# - Node Build Error → Prüfe package.json
# - Permission Error → Prüfe Workflow Permissions
```

### Problem: Partner kann nicht approven

**Ursache:** Partner ist kein Collaborator

**Lösung:**
```bash
# Partner als Collaborator hinzufügen
# Gehe zu: https://github.com/S540d/Eisenhauer/settings/access
# "Add people" → Username eingeben → "Write" Permission
```

### Problem: Merge trotz fehlender Approval möglich

**Ursache:** Branch Protection nicht aktiv

**Lösung:**
```bash
# Setup Script nochmal ausführen
./.github/scripts/setup-branch-protection.sh
```

### Problem: Testing URL 404 Error

**Ursache:** GitHub Pages Environment nicht konfiguriert

**Lösung:**
1. Gehe zu: https://github.com/S540d/Eisenhauer/settings/pages
2. "Add another branch" → `gh-pages-testing`
3. Warte 1-2 Minuten für Propagation

---

## 📈 Best Practices

### 1. Regelmäßig Testing Branch mit Main synchronisieren

```bash
git checkout testing
git pull origin main
git push origin testing
```

### 2. Feature Branches klein halten
- ✅ Eine Funktion = Ein PR
- ✅ Regelmäßig mergen
- ❌ Keine riesigen PRs mit vielen Änderungen

### 3. Aussagekräftige Commit Messages
```bash
# Gut ✅
git commit -m "feat: Add dark mode toggle"
git commit -m "fix: Resolve cache invalidation bug"

# Schlecht ❌
git commit -m "changes"
git commit -m "wip"
```

### 4. Testing Checklist vollständig ausfüllen
- Partner kann nur bewerten, was getestet wurde
- Alle Checkboxen im PR Template nutzen

---

## 🎓 Weiterführende Links

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Pull Request Reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

---

## ✅ Quick Reference

### Häufige Befehle

```bash
# Neues Feature starten
git checkout main && git pull && git checkout -b feature/xyz

# PR erstellen
gh pr create --base main --title "feat: xyz" --fill

# Testing Deploy
git checkout testing && git merge feature/xyz && git push

# Testing URL öffnen
open https://s540d.github.io/Eisenhauer-testing/

# PR Status prüfen
gh pr status

# PR mergen (nach Approval)
gh pr merge <nummer> --squash --delete-branch

# Workflow Status
gh run list --limit 5
```

---

**Implementiert für Issue #74** ✅
**Automatisierung Level: Maximum** 🚀
