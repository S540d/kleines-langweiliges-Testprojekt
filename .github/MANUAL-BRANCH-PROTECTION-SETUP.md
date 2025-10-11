# 🔒 Manuelle Branch Protection Einrichtung

Falls das automatische Setup-Script fehlschlägt, hier die manuelle Anleitung:

## ⏱️ Dauer: 2 Minuten

---

## Schritt 1: Branch Protection Settings öffnen

**Öffne in deinem Browser:**

```
https://github.com/S540d/Eisenhauer/settings/branches
```

Oder manuell:
1. Gehe zu: https://github.com/S540d/Eisenhauer
2. Klicke auf **"Settings"** (oben rechts)
3. Im linken Menü: **"Branches"**

---

## Schritt 2: Branch Protection Rule erstellen

Klicke auf den grünen Button:

```
Add branch protection rule
```

---

## Schritt 3: Branch Name Pattern eingeben

Im Feld **"Branch name pattern"** eingeben:

```
main
```

---

## Schritt 4: Optionen aktivieren

Scrolle nach unten und aktiviere diese Checkboxen:

### ✅ Require a pull request before merging
- **Aktivieren!** ☑️
- Darunter öffnet sich ein Untermenü:

  #### ✅ Require approvals
  - **Aktivieren!** ☑️
  - In das Zahlenfeld eingeben: **1**

  #### ✅ Dismiss stale pull request approvals when new commits are pushed
  - **Aktivieren!** ☑️

### ✅ Require conversation resolution before merging
- **Aktivieren!** ☑️

---

## Schritt 5: Speichern

Scrolle ganz nach unten und klicke:

```
Create
```

---

## ✅ Fertig!

Du solltest jetzt eine Bestätigung sehen:

```
Branch protection rule created
```

---

## 🧪 Test

Teste ob es funktioniert:

```bash
# Versuche direkt auf main zu pushen (sollte fehlschlagen)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin main
```

**Erwartetes Ergebnis:**
```
! [remote rejected] main -> main (protected branch hook declined)
```

Perfekt! Branch Protection ist aktiv. ✅

Jetzt:
```bash
# Änderung rückgängig machen
git reset --hard HEAD~1
rm test.txt
```

---

## 📊 Was ist nun geschützt?

✅ **Kein direkter Push auf `main`** - Nur über Pull Requests
✅ **PR braucht 1 Approval** - Partner muss reviewen
✅ **Stale Reviews werden ungültig** - Bei neuen Commits muss neu reviewed werden
✅ **Conversations müssen resolved sein** - Keine offenen Diskussionen

---

## 🎯 Nächster Schritt

Zurück zum Setup:
```bash
# Weiter mit dem Setup-Script
./.github/scripts/quick-setup.sh
```

Oder lese die vollständige Dokumentation:
```bash
cat TESTING-WORKFLOW.md
```

---

## 🆘 Probleme?

### "Ich sehe keinen Settings Tab"
→ Du brauchst **Admin** oder **Maintain** Rechte für das Repository

### "Kann Branch Protection nicht speichern"
→ Prüfe ob du der Repository Owner bist oder entsprechende Rechte hast

### "Branch Protection Rule existiert bereits"
→ Klicke auf **"Edit"** statt "Add" und aktualisiere die Einstellungen

---

**Das war's!** 🎉
