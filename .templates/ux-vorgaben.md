---
# UX-Vorgaben (für kleine Projekte)

## Barrierefreiheit (Accessibility)
- **Kontraste:** Nutze Farben mit ausreichendem Kontrast (mindestens 4,5:1). Dies kann mit Tools wie [Accessible Colors](https://accessible-colors.com/) überprüft werden.
- **Tastaturnavigation:** Stelle sicher, dass die wichtigsten Funktionen (Navigation, Buttons, Formulare) per Tastatur bedienbar sind.
- **Labels:** Alle interaktiven Elemente (z. B. Buttons, Links) müssen klare Beschriftungen haben.

## Internationalisierung (i18n)
- **Standardsprache:** Definiere die Standardsprache der Anwendung, z. B. Deutsch (`lang="de"` im HTML-Tag).
- **Mehrsprachigkeit:** Für kleine Projekte reicht es, die wichtigsten Texte in einer separaten Datei (`translations.json`) zu organisieren.

## Interaktionsdesign
- **Konsistenz:** Verwende ähnliche Designs für ähnliche Funktionen, z. B. gleiche Button-Styles für alle Aktionen.
- **Feedback:** Zeige bei Benutzeraktionen einfaches Feedback, z. B. eine Erfolgsmeldung oder einen Lade-Spinner.
- **Fehlerhandling:** Fehlermeldungen sollen klar und direkt sein, z. B. „Bitte gib eine gültige E-Mail-Adresse ein“.

## Responsive Design
- **Mobile First:** Entwickle zunächst für Mobilgeräte und erweitere dann für größere Bildschirme.
- **Basistests:** Teste das Design auf Mobil-, Tablet- und Desktop-Bildschirmen.

---