---
# Technische Vorgaben (für kleine Projekte)

## Code-Qualität
- **Prettier:** Alle Dateien müssen vor dem Commit mit Prettier formatiert werden. Führe `npx prettier --write .` aus.
- **ESLint (optional):** Nutze ESLint, um grundlegende Code-Standards sicherzustellen. Verwende die Standardkonfiguration (`eslint-config-standard`).

## Testing
- **Minimaltests:** Schreibe Unit-Tests für kritische Funktionen (z. B. Datenvalidierung). Nutze **Jest** für einfache Tests.
- **Manuelles Testen:** Teste die wichtigsten Benutzerfunktionen manuell (z. B. Formulare, Navigation).

## CI/CD
- **Automatische Checks:** Nutze GitHub Actions für einfache Checks (z. B. Linting und Tests):
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - run: npm install
        - run: npm run lint
        - run: npm test