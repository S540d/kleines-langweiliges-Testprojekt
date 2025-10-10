---
# Technische Vorgaben

## Code-Qualität
- **Prettier** ist verpflichtend für den gesamten Code. Alle Dateien müssen vor einem Commit mit Prettier formatiert werden.
- Verwenden von **ESLint** mit einer zentral definierten Konfiguration, um konsistente Code-Standards sicherzustellen.
- Entfernen von `console.log`-Statements und ungenutztem Code vor jedem Deployment.
- **SonarQube** wird für Code-Qualitätsanalysen genutzt, um technische Schulden zu identifizieren und zu reduzieren.

## Testing
- **Jest** wird für Unit-Tests verwendet. Alle Kernfunktionen sollten durch Tests abgedeckt werden.
- End-to-End-Tests werden mit **Cypress** durchgeführt, um die Benutzeroberfläche und Workflows zu validieren.
- Ziel: Mindestens 90% Testabdeckung für kritische Module.
- Automatisierte Tests müssen Teil der CI/CD-Pipeline sein und vor jedem Merge erfolgreich abgeschlossen werden.

## CI/CD-Pipelines
- **GitHub Actions** wird für Build-, Test- und Deployment-Prozesse verwendet. Beispiele:
  - Automatischer Linting-Check mit Prettier und ESLint bei jedem Push.
  - Automatischer Testlauf mit Jest und Cypress.
- Sicherheits- und Abhängigkeitsprüfungen erfolgen über **Dependabot** und **npm audit**.

## Versionskontrolle
- Befolgen einer **trunk-based Development-Strategie**:
  - Feature-Branches für neue Funktionen, die regelmäßig in den Haupt-Branch (main) gemerged werden.
  - Kurze Lebensdauer von Branches (maximal 2-3 Tage).
- Commit-Nachrichten müssen prägnant und beschreibend sein (z. B. "Fix: Button-Styling in der Navigation").

## Sicherheit
- API-Schlüssel und sensible Daten dürfen nicht im Code enthalten sein. Stattdessen müssen `.env`-Dateien genutzt werden.
- `.env`-Dateien müssen in `.gitignore` eingetragen sein.
- Regelmäßige Sicherheitsaudits mit **npm audit** und **Snyk**, um Schwachstellen zu identifizieren.
- Schutz vor Cross-Site-Scripting (XSS) durch escaping von Benutzereingaben und Vermeidung von `innerHTML`.

---