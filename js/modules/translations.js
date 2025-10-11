/**
 * Translation Module
 * Handles all language-related functionality
 */

export const translations = {
    de: {
        taskInputPlaceholder: 'Neue Aufgabe',
        segments: {
            1: { title: 'Sofort!', subtitle: 'wichtig & dringend' },
            2: { title: 'Planen!', subtitle: 'wichtig' },
            3: { title: 'Abgeben!', subtitle: 'dringend' },
            4: { title: 'Später!', subtitle: 'optional' },
            5: { title: 'Fertig!', subtitle: '' }
        },
        recurring: {
            title: 'Wiederkehrende Aufgabe',
            enableLabel: '🔁 Als wiederkehrende Aufgabe',
            intervalLabel: 'Intervall:',
            daily: 'Täglich',
            weekly: 'Wöchentlich',
            monthly: 'Monatlich',
            custom: 'Benutzerdefiniert',
            customDays: 'Tage:',
            weekdays: {
                monday: 'Montag',
                tuesday: 'Dienstag',
                wednesday: 'Mittwoch',
                thursday: 'Donnerstag',
                friday: 'Freitag',
                saturday: 'Samstag',
                sunday: 'Sonntag'
            },
            dayOfMonth: 'Tag des Monats:',
            indicator: '🔁'
        }
    },
    en: {
        taskInputPlaceholder: 'New task',
        segments: {
            1: { title: 'Do!', subtitle: '' },
            2: { title: 'Schedule!', subtitle: '' },
            3: { title: 'Delegate!', subtitle: '' },
            4: { title: 'Ignore!', subtitle: '' },
            5: { title: 'Done!', subtitle: '' }
        },
        recurring: {
            title: 'Recurring Task',
            enableLabel: '🔁 Make recurring',
            intervalLabel: 'Interval:',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            custom: 'Custom',
            customDays: 'Days:',
            weekdays: {
                monday: 'Monday',
                tuesday: 'Tuesday',
                wednesday: 'Wednesday',
                thursday: 'Thursday',
                friday: 'Friday',
                saturday: 'Saturday',
                sunday: 'Sunday'
            },
            dayOfMonth: 'Day of month:',
            indicator: '🔁'
        }
    }
};

export let currentLanguage = 'en';

export function setLanguage(lang) {
    currentLanguage = lang;
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function getTranslation(key) {
    return translations[currentLanguage];
}

export function getRecurringDescription(recurring) {
    const lang = translations[currentLanguage].recurring;

    switch(recurring.interval) {
        case 'daily':
            return lang.daily;
        case 'weekly':
            if (recurring.weekdays && recurring.weekdays.length > 0) {
                const days = recurring.weekdays.map(day => {
                    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    return lang.weekdays[dayNames[day]];
                });
                return `${lang.weekly}: ${days.join(', ')}`;
            }
            return lang.weekly;
        case 'monthly':
            return `${lang.monthly} (${recurring.dayOfMonth}.)`;
        case 'custom':
            return `${currentLanguage === 'de' ? 'Alle' : 'Every'} ${recurring.customDays} ${currentLanguage === 'de' ? 'Tage' : 'days'}`;
        default:
            return recurring.interval;
    }
}

export function updateLanguageUI(renderAllTasksCallback) {
    const lang = translations[currentLanguage];

    // Update segment headers
    for (let i = 1; i <= 5; i++) {
        const segment = document.querySelector(`.segment[data-segment="${i}"]`);
        if (segment) {
            const header = segment.querySelector('.segment-header h2');
            if (header) {
                const segmentData = lang.segments[i];
                if (segmentData.subtitle) {
                    header.innerHTML = `${segmentData.title} <span style="font-size: 0.7em; opacity: 0.7; font-weight: 400;">${segmentData.subtitle}</span>`;
                } else {
                    header.textContent = segmentData.title;
                }
            }
        }
    }

    // Update modal segment buttons
    const segmentButtons = document.querySelectorAll('.segment-btn');
    segmentButtons.forEach((btn) => {
        const segmentId = parseInt(btn.dataset.segment);
        const segmentData = lang.segments[segmentId];
        if (segmentData.subtitle) {
            btn.innerHTML = `<strong>${segmentData.title}</strong><br><span style="font-size: 0.8em; opacity: 0.8;">${segmentData.subtitle}</span>`;
        } else {
            btn.innerHTML = `<strong>${segmentData.title}</strong>`;
        }
    });

    // Update recurring task UI translations
    const recurringEnableText = document.getElementById('recurringEnableText');
    if (recurringEnableText) {
        recurringEnableText.textContent = lang.recurring.enableLabel;
    }

    const recurringIntervalLabel = document.getElementById('recurringIntervalLabel');
    if (recurringIntervalLabel) {
        recurringIntervalLabel.textContent = lang.recurring.intervalLabel;
    }

    // Update interval select options
    const recurringInterval = document.getElementById('recurringInterval');
    if (recurringInterval) {
        recurringInterval.querySelector('option[value="daily"]').textContent = lang.recurring.daily;
        recurringInterval.querySelector('option[value="weekly"]').textContent = lang.recurring.weekly;
        recurringInterval.querySelector('option[value="monthly"]').textContent = lang.recurring.monthly;
        recurringInterval.querySelector('option[value="custom"]').textContent = lang.recurring.custom;
    }

    // Update weekday labels
    const weekdayMap = {
        'weekday-monday': 'monday',
        'weekday-tuesday': 'tuesday',
        'weekday-wednesday': 'wednesday',
        'weekday-thursday': 'thursday',
        'weekday-friday': 'friday',
        'weekday-saturday': 'saturday',
        'weekday-sunday': 'sunday'
    };

    Object.entries(weekdayMap).forEach(([id, key]) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.textContent = currentLanguage === 'de'
                ? lang.recurring.weekdays[key].substring(0, 2)
                : lang.recurring.weekdays[key].substring(0, 3);
        }
    });

    const dayOfMonthLabel = document.getElementById('dayOfMonthLabel');
    if (dayOfMonthLabel) {
        dayOfMonthLabel.textContent = lang.recurring.dayOfMonth;
    }

    const customDaysLabel = document.getElementById('customDaysLabel');
    if (customDaysLabel) {
        customDaysLabel.textContent = lang.recurring.customDays;
    }

    // Update task input placeholder
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.placeholder = lang.taskInputPlaceholder;
    }

    // Update drag hint text
    const dragHint = document.getElementById('dragHint');
    if (dragHint) {
        const hintText = currentLanguage === 'de'
            ? '💡 <strong>Tipp:</strong> Ziehe Aufgaben zwischen Kategorien, um sie zu verschieben. Wische nach links, um zu löschen.'
            : '💡 <strong>Tip:</strong> Drag tasks between categories to move them. Swipe left to delete.';
        const hintParagraph = dragHint.querySelector('p');
        if (hintParagraph) {
            hintParagraph.innerHTML = hintText;
        }

        const btnText = currentLanguage === 'de' ? 'Verstanden' : 'Got it';
        const hintButton = dragHint.querySelector('button');
        if (hintButton) {
            hintButton.textContent = btnText;
        }
    }

    // Re-render all tasks to update recurring indicators
    if (renderAllTasksCallback) {
        renderAllTasksCallback();
    }
}
