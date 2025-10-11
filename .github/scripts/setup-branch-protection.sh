#!/bin/bash

# Automatisches Setup für Branch Protection Rules
# Dieses Script richtet die Branch Protection für main ein

set -e

REPO_OWNER="S540d"
REPO_NAME="Eisenhauer"
BRANCH="main"

echo "🔒 Setting up branch protection for ${REPO_OWNER}/${REPO_NAME}:${BRANCH}"

# Prüfe ob gh CLI installiert ist
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) ist nicht installiert!"
    echo "   Installation: https://cli.github.com/"
    exit 1
fi

# Prüfe ob authentifiziert
if ! gh auth status &> /dev/null; then
    echo "❌ Nicht bei GitHub authentifiziert!"
    echo "   Führe aus: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI ist bereit"

# Branch Protection Rules setzen
echo "📝 Setze Branch Protection Rules..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "/repos/${REPO_OWNER}/${REPO_NAME}/branches/${BRANCH}/protection" \
  -f required_status_checks='null' \
  -F enforce_admins=false \
  -f required_pull_request_reviews='{
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  }' \
  -f restrictions='null' \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F block_creations=false \
  -F required_conversation_resolution=true \
  -F lock_branch=false \
  -F allow_fork_syncing=true

echo ""
echo "✅ Branch Protection erfolgreich eingerichtet!"
echo ""
echo "📋 Konfiguration:"
echo "   ✓ Pull Request Reviews erforderlich: 1 Approval"
echo "   ✓ Stale Reviews werden verworfen"
echo "   ✓ Conversation Resolution erforderlich"
echo "   ✓ Force Pushes blockiert"
echo "   ✓ Branch kann nicht gelöscht werden"
echo ""
echo "🎯 Workflow:"
echo "   1. Erstelle einen PR gegen 'main'"
echo "   2. Merge in 'testing' für Tests"
echo "   3. Partner reviewed und approved"
echo "   4. Merge in 'main' möglich"
echo ""
