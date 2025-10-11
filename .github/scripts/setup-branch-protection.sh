#!/bin/bash

# Automatisches Setup für Branch Protection Rules
# Dieses Script richtet die Branch Protection für main ein

REPO_OWNER="S540d"
REPO_NAME="Eisenhauer"
BRANCH="main"

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔒 Setting up branch protection for ${REPO_OWNER}/${REPO_NAME}:${BRANCH}${NC}"
echo ""

# Prüfe ob gh CLI installiert ist
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) ist nicht installiert!${NC}"
    echo "   Installation: https://cli.github.com/"
    exit 1
fi

# Prüfe ob authentifiziert
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Nicht bei GitHub authentifiziert!${NC}"
    echo "   Führe aus: gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI ist bereit${NC}"
echo ""

# Branch Protection Rules setzen
echo "📝 Versuche Branch Protection automatisch einzurichten..."
echo ""

# Erstelle JSON für Branch Protection
PROTECTION_JSON=$(cat <<'EOF'
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  },
  "enforce_admins": null,
  "required_status_checks": null,
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
)

# Versuche Branch Protection zu setzen
if echo "$PROTECTION_JSON" | gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "/repos/${REPO_OWNER}/${REPO_NAME}/branches/${BRANCH}/protection" \
  --input - > /dev/null 2>&1; then

  echo -e "${GREEN}✅ Branch Protection erfolgreich eingerichtet!${NC}"
  echo ""
  echo "📋 Konfiguration:"
  echo "   ✓ Pull Request Reviews erforderlich: 1 Approval"
  echo "   ✓ Stale Reviews werden verworfen"
  echo "   ✓ Conversation Resolution erforderlich"
  echo "   ✓ Force Pushes blockiert"
  echo "   ✓ Branch kann nicht gelöscht werden"

else
  echo -e "${YELLOW}⚠️  Automatisches Setup fehlgeschlagen${NC}"
  echo ""
  echo -e "${YELLOW}Das ist normal! Meist fehlen Admin-Rechte für automatisches Setup.${NC}"
  echo ""
  echo -e "${GREEN}📝 MANUELLE EINRICHTUNG (dauert 2 Minuten):${NC}"
  echo ""
  echo "1. Öffne in Browser:"
  echo "   ${YELLOW}https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/branches${NC}"
  echo ""
  echo "2. Klicke auf: ${GREEN}'Add branch protection rule'${NC}"
  echo ""
  echo "3. Branch name pattern eingeben: ${GREEN}main${NC}"
  echo ""
  echo "4. Aktiviere diese Optionen:"
  echo "   ${GREEN}☑${NC} Require a pull request before merging"
  echo "      └ ${GREEN}☑${NC} Require approvals: ${GREEN}1${NC}"
  echo "      └ ${GREEN}☑${NC} Dismiss stale pull request approvals when new commits are pushed"
  echo "   ${GREEN}☑${NC} Require conversation resolution before merging"
  echo ""
  echo "5. Scroll nach unten und klicke: ${GREEN}'Create'${NC}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  read -p "Drücke Enter wenn fertig... "
  echo ""
  echo -e "${GREEN}✅ Branch Protection sollte nun aktiv sein!${NC}"
fi

echo ""
echo "🎯 Workflow:"
echo "   1. Erstelle einen PR gegen 'main'"
echo "   2. Merge in 'testing' für Tests"
echo "   3. Partner reviewed und approved"
echo "   4. Merge in 'main' möglich"
echo ""
