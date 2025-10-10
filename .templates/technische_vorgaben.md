---
# Technische Vorgaben

## Code-Qualität
- **Prettier:** Prettier ist verpflichtend. Code muss vor jedem Commit formatiert werden.
- **ESLint:** Nutze die zentrale ESLint-Konfiguration `eslint-config-standard`. Fehler und Warnungen sind nicht erlaubt.
- **SonarQube:** SonarQube wird für die Code-Qualitätsanalyse genutzt. Ziel: Technische Schulden < 5%.

## Testing
- **Jest:** Schreibe Unit-Tests mit Jest für jede neue Funktion. Kritische Module müssen eine Testabdeckung von 100% erreichen.
- **Cypress:** End-to-End-Tests werden mit Cypress durchgeführt. Diese müssen vor jedem Release erfolgreich sein.
- **Snapshots:** Nutze Storyshots (Storybook-Addon), um visuelle Regressionen zu identifizieren.

## CI/CD-Pipelines
- **GitHub Actions:** Automatisiere Linter- und Testläufe bei jedem Commit. PRs mit fehlgeschlagenen Checks werden blockiert.
- **Deployment:** Deployments erfolgen automatisch auf Staging nach einem Merge in `main`.
- **Dependabot:** Sicherheits- und Abhängigkeitsprüfungen werden automatisch durch Dependabot durchgeführt.

## Versionskontrolle
- **Branch-Strategie:** Nutze trunk-based Development:
  - Feature-Branches dürfen maximal 2-3 Tage bestehen.
  - Regelmäßiges Mergen in `main`, um Konﬂikte zu vermeiden.
- **Commit-Nachrichten:** Nachrichten müssen prägnant und beschreibend sein (z. B. „Fix: Button-Styling in Navigation“).

## Sicherheit
- **Umgebungsvariablen:** API-Schlüssel und Tokens müssen in `.env`-Dateien gespeichert werden. Diese Dateien müssen in `.gitignore` stehen.
- **XSS-Schutz:** Escape alle Benutzereingaben und nutze Sicherheitsmechanismen von Frameworks (z. B. Reacts `dangerouslySetInnerHTML` vermeiden).
- **Sicherheitsaudits:** Nutze Tools wie **Snyk** und **npm audit**, um Schwachstellen regelmäßig zu überprüfen.

---