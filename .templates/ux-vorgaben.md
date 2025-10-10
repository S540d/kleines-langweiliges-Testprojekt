---
# UX-Vorgaben

## Barrierefreiheit (Accessibility)
- **Farben und Kontraste:** Verwende die Farbpaletten aus der `.design-tokens`-Datei, um die WCAG 2.1 AA-Standards (Kontrastverhältnis ≥ 4,5:1) einzuhalten.
- **Tastaturnavigation:** Alle interaktiven Elemente müssen mit der Tastatur erreichbar sein. Fokuszustände müssen sichtbar und klar definiert sein.
- **Screenreader-Unterstützung:** Nutze semantisches HTML und ARIA-Attribute nur, wenn unbedingt nötig (z. B. `aria-label` für Buttons ohne Text).
- **Barrierefreie Labels:** Alle Buttons, Links und Formulare benötigen beschreibende Labels.

## Internationalisierung (i18n)
- **Standardsprache:** Die Standardsprache ist Deutsch (`lang="de"`). Stelle sicher, dass die Sprache korrekt im HTML-Tag definiert ist.
- **Übersetzungen:** Inhalte müssen mit einem Framework wie **i18next** übersetzt werden. Übersetzungsdateien liegen als `de.json`, `en.json` usw. vor.
- **RTL-Unterstützung:** Stelle sicher, dass das Layout auch für Sprachen mit Rechts-nach-Links-Schreibweise (z. B. Arabisch) funktioniert.

## Interaktionsdesign
- **Konsistenz:** Nutze UI-Komponenten aus der zentralen Storybook-Bibliothek. Jede Komponente muss dokumentiert und getestet sein.
- **Feedback:** Jede Benutzeraktion muss ein visuelles Feedback (z. B. Ladeindikator) liefern.
- **Fehlerhandling:** Fehlermeldungen sollen klar und hilfreich sein, z. B. „Bitte E-Mail-Adresse eingeben“ statt „Ungültig“.

## Design-Richtlinien
- **Komponentenbibliothek