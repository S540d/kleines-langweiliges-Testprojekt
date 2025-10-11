#!/bin/bash

# Daily Cleanup Script für Eisenhauer
# Automatisiert alle End-of-Day Tasks

set -e

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters für Summary
BRANCHES_DELETED=0
COMMITS_PUSHED=0
WARNINGS=0

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           🧹 EISENHAUER DAILY CLEANUP 🧹                  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# ============================================================================
# 1. REPOSITORY STATUS
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📊 1. Repository Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Git Status
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes found:${NC}"
    git status --short
    echo ""
    read -p "Commit diese Änderungen? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Commit message: " COMMIT_MSG
        git add -A
        git commit -m "$COMMIT_MSG"
        COMMITS_PUSHED=$((COMMITS_PUSHED + 1))
        echo -e "${GREEN}✅ Committed${NC}"
    fi
else
    echo -e "${GREEN}✅ Working tree clean${NC}"
fi

# Current Branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "📍 Current branch: ${GREEN}${CURRENT_BRANCH}${NC}"

# Sync Status
echo ""
git fetch origin --quiet
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

if [ "$REMOTE" = "" ]; then
    echo -e "${YELLOW}⚠️  No upstream branch${NC}"
elif [ "$LOCAL" = "$REMOTE" ]; then
    echo -e "${GREEN}✅ Branch is up to date with origin${NC}"
elif [ "$LOCAL" = "$BASE" ]; then
    echo -e "${YELLOW}⚠️  Need to pull${NC}"
    git pull
elif [ "$REMOTE" = "$BASE" ]; then
    echo -e "${YELLOW}⚠️  Need to push${NC}"
else
    echo -e "${YELLOW}⚠️  Branches have diverged${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================================================
# 2. BRANCH CLEANUP
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🌿 2. Branch Cleanup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Liste alle lokalen Branches außer main, testing, gh-pages
LOCAL_BRANCHES=$(git branch | grep -v "main\|testing\|gh-pages" | sed 's/^[* ]*//' || true)

if [ -z "$LOCAL_BRANCHES" ]; then
    echo -e "${GREEN}✅ Keine Feature Branches zum Aufräumen${NC}"
else
    echo -e "${YELLOW}Lokale Feature Branches:${NC}"
    echo "$LOCAL_BRANCHES" | while read branch; do
        # Prüfe ob gemerged
        if git branch --merged main | grep -q "$branch"; then
            echo -e "  ${GREEN}✓${NC} $branch ${CYAN}(merged)${NC}"
        else
            echo -e "  ${YELLOW}○${NC} $branch ${YELLOW}(not merged)${NC}"
        fi
    done

    echo ""
    read -p "Merged Branches löschen? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch --merged main | grep -v "main\|testing\|gh-pages\|\*" | xargs -r git branch -d
        DELETED=$(git branch --merged main | grep -v "main\|testing\|gh-pages\|\*" | wc -l)
        BRANCHES_DELETED=$((BRANCHES_DELETED + DELETED))
        echo -e "${GREEN}✅ $DELETED Branches gelöscht${NC}"
    fi
fi

# Remote Branches
echo ""
REMOTE_BRANCHES=$(git branch -r --merged origin/main | grep "origin/" | grep -v "main\|testing\|gh-pages\|HEAD" | sed 's/origin\///' || true)

if [ ! -z "$REMOTE_BRANCHES" ]; then
    echo -e "${YELLOW}Remote merged Branches:${NC}"
    echo "$REMOTE_BRANCHES"
    echo ""
    read -p "Remote Branches löschen? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$REMOTE_BRANCHES" | xargs -r git push origin --delete
        echo -e "${GREEN}✅ Remote Branches gelöscht${NC}"
    fi
fi

echo ""

# ============================================================================
# 3. TESTING ENVIRONMENT
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🧪 3. Testing Environment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Prüfe ob testing Branch existiert
if git show-ref --verify --quiet refs/heads/testing; then
    # Prüfe Sync mit main
    MAIN_SHA=$(git rev-parse main)
    TESTING_SHA=$(git rev-parse testing)

    if [ "$MAIN_SHA" = "$TESTING_SHA" ]; then
        echo -e "${GREEN}✅ Testing Branch ist mit main synchron${NC}"
    else
        echo -e "${YELLOW}⚠️  Testing Branch ist nicht mit main synchron${NC}"
        echo ""
        read -p "Testing Branch mit main synchronisieren? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git checkout testing
            git merge main --no-edit
            git push origin testing
            git checkout "$CURRENT_BRANCH"
            echo -e "${GREEN}✅ Testing Branch synchronisiert${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Testing Branch existiert nicht${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================================================
# 4. GITHUB ACTIONS STATUS
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🤖 4. GitHub Actions Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if command -v gh &> /dev/null; then
    # Production Deploy
    echo -e "${MAGENTA}Production Deploys:${NC}"
    gh run list --workflow=deploy.yml --limit 3 --json conclusion,status,displayTitle,createdAt --jq '.[] | "  \(.conclusion // .status) - \(.displayTitle) (\(.createdAt | split("T")[0]))"' || echo "  Keine Runs gefunden"

    echo ""

    # Testing Deploy
    echo -e "${MAGENTA}Testing Deploys:${NC}"
    gh run list --workflow=deploy-testing.yml --limit 3 --json conclusion,status,displayTitle,createdAt --jq '.[] | "  \(.conclusion // .status) - \(.displayTitle) (\(.createdAt | split("T")[0]))"' || echo "  Keine Runs gefunden"

    # Failed Runs
    FAILED_RUNS=$(gh run list --limit 10 --json conclusion --jq '[.[] | select(.conclusion == "failure")] | length')
    if [ "$FAILED_RUNS" -gt 0 ]; then
        echo ""
        echo -e "${RED}⚠️  $FAILED_RUNS failed runs in letzten 10${NC}"
        WARNINGS=$((WARNINGS + FAILED_RUNS))
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI nicht verfügbar (gh)${NC}"
fi

echo ""

# ============================================================================
# 5. PULL REQUESTS
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔀 5. Pull Requests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if command -v gh &> /dev/null; then
    OPEN_PRS=$(gh pr list --json number,title,state,createdAt,isDraft --jq 'length')

    if [ "$OPEN_PRS" -eq 0 ]; then
        echo -e "${GREEN}✅ Keine offenen Pull Requests${NC}"
    else
        echo -e "${YELLOW}$OPEN_PRS offene Pull Requests:${NC}"
        gh pr list --json number,title,createdAt,isDraft --jq '.[] | "  #\(.number) - \(.title) (\(.createdAt | split("T")[0])) \(if .isDraft then "(DRAFT)" else "" end)"'
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI nicht verfügbar${NC}"
fi

echo ""

# ============================================================================
# 6. ISSUES MANAGEMENT
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📋 6. Issues Management${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if command -v gh &> /dev/null; then
    # Prio Issues
    PRIO_ISSUES=$(gh issue list --label "Prio" --json number,title --jq 'length')
    if [ "$PRIO_ISSUES" -gt 0 ]; then
        echo -e "${YELLOW}⚡ $PRIO_ISSUES Prio Issues:${NC}"
        gh issue list --label "Prio" --limit 5 --json number,title --jq '.[] | "  #\(.number) - \(.title)"'
        echo ""
    fi

    # Kürzlich geschlossen
    CLOSED_TODAY=$(gh issue list --state closed --search "closed:>=$(date -v-1d +%Y-%m-%d)" --json number,title --jq 'length' 2>/dev/null || echo "0")
    if [ "$CLOSED_TODAY" -gt 0 ]; then
        echo -e "${GREEN}✅ $CLOSED_TODAY Issues heute geschlossen${NC}"
        echo ""
    fi
fi

echo ""

# ============================================================================
# 7. DEPENDENCIES & SECURITY
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔒 7. Dependencies & Security${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "package.json" ]; then
    # Outdated Packages
    echo -e "${MAGENTA}Checking for outdated packages...${NC}"
    OUTDATED=$(npm outdated 2>/dev/null | tail -n +2 | wc -l)
    if [ "$OUTDATED" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $OUTDATED packages outdated${NC}"
        npm outdated
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ All packages up to date${NC}"
    fi

    echo ""

    # Security Audit
    echo -e "${MAGENTA}Running security audit...${NC}"
    if npm audit --audit-level=moderate 2>&1 | grep -q "found 0 vulnerabilities"; then
        echo -e "${GREEN}✅ No vulnerabilities found${NC}"
    else
        echo -e "${YELLOW}⚠️  Vulnerabilities found:${NC}"
        npm audit --audit-level=moderate
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""

# ============================================================================
# 8. SYNC & PUSH
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 8. Sync & Push${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Auf main wechseln
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}Wechsle zu main Branch...${NC}"
    git checkout main
fi

# Pull
echo "Fetching latest changes..."
git pull origin main

# Push
if [ "$COMMITS_PUSHED" -gt 0 ]; then
    echo "Pushing commits..."
    git push origin main
    echo -e "${GREEN}✅ $COMMITS_PUSHED commits pushed${NC}"
fi

# Zurück zum ursprünglichen Branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    git checkout "$CURRENT_BRANCH"
fi

echo ""

# ============================================================================
# 9. BACKUP REMINDER
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}💾 9. Backup Reminder${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Suche nach letztem Backup in Commit Messages
LAST_BACKUP=$(git log --all --grep="backup" --format="%ci" --date=short -1 2>/dev/null | cut -d' ' -f1)

if [ -z "$LAST_BACKUP" ]; then
    echo -e "${YELLOW}⚠️  Kein Backup in Git History gefunden${NC}"
    echo -e "   ${CYAN}Tipp: Exportiere JSON über Eisenhauer App Settings${NC}"
else
    # Berechne Tage seit letztem Backup
    DAYS_SINCE=$(( ( $(date +%s) - $(date -j -f "%Y-%m-%d" "$LAST_BACKUP" +%s) ) / 86400 ))

    if [ "$DAYS_SINCE" -gt 7 ]; then
        echo -e "${YELLOW}⚠️  Letztes Backup: $LAST_BACKUP ($DAYS_SINCE Tage her)${NC}"
        echo -e "   ${CYAN}Zeit für ein neues Backup!${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ Letztes Backup: $LAST_BACKUP ($DAYS_SINCE Tage her)${NC}"
    fi
fi

echo ""

# ============================================================================
# 10. SUMMARY
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📊 10. Zusammenfassung${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${MAGENTA}Heute erledigt:${NC}"
echo -e "  🌿 Branches gelöscht: ${GREEN}$BRANCHES_DELETED${NC}"
echo -e "  📤 Commits gepusht: ${GREEN}$COMMITS_PUSHED${NC}"

if [ "$WARNINGS" -gt 0 ]; then
    echo -e "  ⚠️  Warnungen: ${YELLOW}$WARNINGS${NC}"
else
    echo -e "  ✅ Keine Warnungen"
fi

echo ""
echo -e "${MAGENTA}Environment Status:${NC}"
echo -e "  🚀 Production: ${GREEN}https://s540d.github.io/Eisenhauer/${NC}"
echo -e "  🧪 Testing: ${CYAN}https://s540d.github.io/Eisenhauer-testing/${NC}"

echo ""
echo -e "${MAGENTA}Nächste Schritte:${NC}"
if command -v gh &> /dev/null; then
    gh issue list --label "Prio" --limit 3 --json number,title --jq '.[] | "  • #\(.number): \(.title)"'
else
    echo "  • Prüfe Prio Issues auf GitHub"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║              ✨ CLEANUP ABGESCHLOSSEN ✨                   ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
