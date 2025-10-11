#!/bin/bash

# Quick Setup für Testing Workflow (Issue #74)
# Führt alle notwendigen Schritte automatisch aus

set -e

echo "🚀 Eisenhauer Testing Workflow Setup"
echo "===================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktion für Success Messages
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Funktion für Info Messages
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Funktion für Error Messages
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob im richtigen Verzeichnis
if [ ! -f "package.json" ] || [ ! -d ".github" ]; then
    error "Nicht im Eisenhauer Repository!"
    error "Führe dieses Script im Root des Repositories aus"
    exit 1
fi

success "Im richtigen Verzeichnis"

# Prüfe gh CLI
if ! command -v gh &> /dev/null; then
    error "GitHub CLI (gh) nicht installiert!"
    info "Installation: https://cli.github.com/"
    exit 1
fi

success "GitHub CLI gefunden"

# Prüfe Authentication
if ! gh auth status &> /dev/null; then
    error "Nicht bei GitHub authentifiziert!"
    info "Führe aus: gh auth login"
    exit 1
fi

success "GitHub Authentifizierung OK"

# Schritt 1: Testing Branch erstellen/aktualisieren
echo ""
echo "📝 Schritt 1: Testing Branch"
echo "----------------------------"

git fetch origin

if git rev-parse --verify testing &> /dev/null; then
    info "Testing Branch existiert bereits"
    git checkout testing
    git pull origin main
    git push origin testing
    success "Testing Branch aktualisiert"
else
    info "Erstelle Testing Branch..."
    git checkout main
    git pull origin main
    git checkout -b testing
    git push -u origin testing
    success "Testing Branch erstellt"
fi

git checkout main

# Schritt 2: Branch Protection
echo ""
echo "🔒 Schritt 2: Branch Protection"
echo "--------------------------------"

info "Setze Branch Protection Rules..."
if ./.github/scripts/setup-branch-protection.sh; then
    success "Branch Protection aktiv"
else
    error "Branch Protection Setup fehlgeschlagen"
    info "Manuelles Setup in GitHub Settings erforderlich"
fi

# Schritt 3: GitHub Pages Testing Environment
echo ""
echo "🌐 Schritt 3: GitHub Pages Testing"
echo "-----------------------------------"

info "Prüfe GitHub Pages Konfiguration..."

# Prüfe ob gh-pages-testing Branch existiert
if gh api /repos/S540d/Eisenhauer/git/refs/heads/gh-pages-testing &> /dev/null; then
    success "gh-pages-testing Branch existiert"
else
    info "gh-pages-testing Branch wird beim ersten Deploy erstellt"
fi

echo ""
echo "⚠️  WICHTIG: GitHub Pages Testing manuell aktivieren:"
echo "   1. Gehe zu: https://github.com/S540d/Eisenhauer/settings/pages"
echo "   2. 'Add another branch' anklicken"
echo "   3. Branch 'gh-pages-testing' auswählen"
echo "   4. Speichern"
echo ""
read -p "Drücke Enter wenn erledigt..."

success "GitHub Pages Testing sollte nun aktiv sein"

# Schritt 4: Test-Deploy
echo ""
echo "🧪 Schritt 4: Test Deploy"
echo "-------------------------"

info "Trigger Testing Deploy..."

git checkout testing
git push origin testing

echo ""
info "Warte auf GitHub Action (30 Sekunden)..."
sleep 30

# Prüfe letzten Workflow Run
echo ""
info "Prüfe Deploy Status..."

WORKFLOW_STATUS=$(gh run list --workflow=deploy-testing.yml --limit 1 --json status --jq '.[0].status')

if [ "$WORKFLOW_STATUS" == "completed" ]; then
    success "Testing Deploy erfolgreich!"
elif [ "$WORKFLOW_STATUS" == "in_progress" ]; then
    info "Deploy läuft noch..."
    info "Prüfe mit: gh run list --workflow=deploy-testing.yml"
else
    error "Deploy Status: $WORKFLOW_STATUS"
    info "Prüfe Logs mit: gh run list --workflow=deploy-testing.yml"
fi

git checkout main

# Zusammenfassung
echo ""
echo "✨ Setup Abgeschlossen!"
echo "======================"
echo ""
echo "📋 Testing URLs:"
echo "   Testing:    https://s540d.github.io/Eisenhauer-testing/"
echo "   Production: https://s540d.github.io/Eisenhauer/"
echo ""
echo "📖 Workflow Dokumentation:"
echo "   cat TESTING-WORKFLOW.md"
echo ""
echo "🎯 Nächste Schritte:"
echo "   1. Partner als Collaborator hinzufügen:"
echo "      → https://github.com/S540d/Eisenhauer/settings/access"
echo ""
echo "   2. Ersten Test-PR erstellen:"
echo "      git checkout -b feature/test"
echo "      # ... Änderungen machen ..."
echo "      gh pr create --base main --fill"
echo ""
echo "   3. In testing mergen:"
echo "      git checkout testing && git merge feature/test && git push"
echo ""
echo "   4. Testing URL testen:"
echo "      open https://s540d.github.io/Eisenhauer-testing/"
echo ""
echo "🎉 Viel Erfolg!"
