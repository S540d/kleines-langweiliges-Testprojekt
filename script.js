// App Version - loaded from package.json
let APP_VERSION = 'v1.3.1'; // Fallback version
const BUILD_DATE = new Date().toISOString().split('T')[0]; // Auto-generated build date

// Fetch version from package.json
fetch('./package.json')
    .then(response => response.json())
    .then(data => {
        APP_VERSION = 'v' + data.version;
        const versionElement = document.getElementById('versionNumber');
        if (versionElement) {
            versionElement.textContent = APP_VERSION;
        }
        const settingsVersion = document.getElementById('settingsVersion');
        if (settingsVersion) {
            settingsVersion.textContent = `Version: ${APP_VERSION}`;
        }
    })
    .catch(error => {
        console.warn('Could not load version from package.json:', error);
    });

// Language translations
const translations = {
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
        },
        metrics: {
            title: '📊 Produktivitäts-Statistiken',
            overview: 'Übersicht',
            totalCompleted: 'Gesamt erledigt',
            streak: 'Tage Streak',
            avgTime: 'Ø Bearbeitungszeit',
            completedTasks: 'Erledigte Aufgaben',
            distribution: 'Verteilung nach Segmenten',
            day: 'Tag',
            week: 'Woche',
            month: 'Monat',
            close: 'Schließen',
            chartLabel: 'Erledigte Aufgaben'
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
        },
        metrics: {
            title: '📊 Productivity Statistics',
            overview: 'Overview',
            totalCompleted: 'Total Completed',
            streak: 'Day Streak',
            avgTime: 'Avg. Processing Time',
            completedTasks: 'Completed Tasks',
            distribution: 'Distribution by Segments',
            day: 'Day',
            week: 'Week',
            month: 'Month',
            close: 'Close',
            chartLabel: 'Completed Tasks'
        }
    }
};

let currentLanguage = 'en';

// Task Management
let tasks = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
};

let currentTask = null;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const modal = document.getElementById('segmentModal');
const cancelBtn = document.getElementById('cancelBtn');
const segmentBtns = document.querySelectorAll('.segment-btn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsCancelBtn = document.getElementById('settingsCancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const languageToggle = document.getElementById('languageToggle');
const darkModeToggle = document.getElementById('darkModeToggle');
// const searchInput = document.getElementById('searchInput'); // Removed from UI
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const metricsBtn = document.getElementById('metricsBtn');
const metricsModal = document.getElementById('metricsModal');
const metricsCancelBtn = document.getElementById('metricsCancelBtn');

// Recurring Task Elements
const recurringEnabled = document.getElementById('recurringEnabled');
const recurringOptions = document.getElementById('recurringOptions');
const recurringInterval = document.getElementById('recurringInterval');
const weeklyOptions = document.getElementById('weeklyOptions');
const monthlyOptions = document.getElementById('monthlyOptions');
const customOptions = document.getElementById('customOptions');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Display version number
    const versionElement = document.getElementById('versionNumber');
    if (versionElement) {
        versionElement.textContent = APP_VERSION;
    }

    // Load dark mode preference
    const darkMode = await localforage.getItem('darkMode');
    if (darkMode === true) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Load language preference
    const savedLanguage = await localforage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    languageToggle.value = currentLanguage;
    updateLanguage();

    // Show drag hint if not seen before
    const dragHintSeen = await localforage.getItem('dragHintSeen');
    if (!dragHintSeen) {
        showDragHint();
    }

    renderAllTasks();
    setupDragAndDrop();
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

// Enter Key in Input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Cancel Button
cancelBtn.addEventListener('click', closeModal);

// Segment Selection Buttons
segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const segmentId = parseInt(btn.dataset.segment);
        if (currentTask) {
            addTaskToSegment(currentTask, segmentId);
            currentTask = null;
        }
        closeModal();
    });
});

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Settings Button
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        openSettingsModal();
    });
}

// Settings Cancel Button
if (settingsCancelBtn) {
    settingsCancelBtn.addEventListener('click', () => {
        closeSettingsModal();
    });
}

// Settings modal background click
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
}

// Logout Button
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Möchtest du dich wirklich abmelden?')) {
            signOut();
        }
    });
}

// Language Toggle
languageToggle.addEventListener('change', async (e) => {
    currentLanguage = e.target.value;
    await localforage.setItem('language', currentLanguage);
    updateLanguage();
});

// Dark Mode Toggle
darkModeToggle.addEventListener('change', async (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        await localforage.setItem('darkMode', true);
    } else {
        document.body.classList.remove('dark-mode');
        await localforage.setItem('darkMode', false);
    }
});

// Search Input - Removed from UI
// searchInput.addEventListener('input', (e) => {
//     const searchTerm = e.target.value.toLowerCase().trim();
//     filterTasks(searchTerm);
// });

// Export Button
exportBtn.addEventListener('click', () => {
    exportData();
});

// Import Button
importBtn.addEventListener('click', () => {
    importFile.click();
});

// Import File Handler
importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        importData(file);
    }
    // Reset file input
    e.target.value = '';
});

// Recurring Task Event Listeners
recurringEnabled.addEventListener('change', (e) => {
    recurringOptions.style.display = e.target.checked ? 'block' : 'none';
});

recurringInterval.addEventListener('change', (e) => {
    // Hide all interval-specific options
    weeklyOptions.style.display = 'none';
    monthlyOptions.style.display = 'none';
    customOptions.style.display = 'none';
    
    // Show relevant option based on selected interval
    switch(e.target.value) {
        case 'weekly':
            weeklyOptions.style.display = 'block';
            break;
        case 'monthly':
            monthlyOptions.style.display = 'block';
            break;
        case 'custom':
            customOptions.style.display = 'block';
            break;
    }
});

// Metrics Button
metricsBtn.addEventListener('click', () => {
    closeSettingsModal();
    openMetricsModal();
});

// Metrics Cancel Button
metricsCancelBtn.addEventListener('click', () => {
    closeMetricsModal();
});

// Metrics modal background click
metricsModal.addEventListener('click', (e) => {
    if (e.target === metricsModal) {
        closeMetricsModal();
    }
});

// Quick Add Modal Elements (v1.4.5+)
const quickAddModal = document.getElementById('quickAddModal');
const quickAddInput = document.getElementById('quickAddInput');
const quickAddCharCount = document.getElementById('quickAddCharCount');
const quickAddCategory = document.getElementById('quickAddCategory');
const quickAddSubmitBtn = document.getElementById('quickAddSubmitBtn');
const quickAddCancelBtn = document.getElementById('quickAddCancelBtn');
const quickRecurringEnabled = document.getElementById('quickRecurringEnabled');
const quickRecurringOptions = document.getElementById('quickRecurringOptions');
let currentQuickAddSegment = null;

// Segment names for display
const segmentNames = {
    1: { de: 'Do! (Dringend & Wichtig)', en: 'Do! (Urgent & Important)' },
    2: { de: 'Schedule! (Nicht dringend & Wichtig)', en: 'Schedule! (Not Urgent & Important)' },
    3: { de: 'Delegate! (Dringend & Nicht wichtig)', en: 'Delegate! (Urgent & Not Important)' },
    4: { de: 'Ignore! (Nicht dringend & Nicht wichtig)', en: 'Ignore! (Not Urgent & Not Important)' },
    5: { de: 'Done! (Erledigt)', en: 'Done! (Completed)' }
};

// Segment Add Buttons (v1.4.5+ - opens custom modal)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('segment-add-btn')) {
        const segmentId = parseInt(e.target.dataset.segment);
        openQuickAddModal(segmentId);
    }
});

// Open Quick Add Modal
function openQuickAddModal(segmentId) {
    currentQuickAddSegment = segmentId;
    quickAddInput.value = '';
    quickAddCharCount.textContent = '0/140';
    quickAddCharCount.classList.remove('warning', 'error');
    quickRecurringEnabled.checked = false;
    quickRecurringOptions.style.display = 'none';

    // Set category title
    const categoryName = segmentNames[segmentId][currentLanguage] || segmentNames[segmentId]['en'];
    quickAddCategory.textContent = categoryName;

    // Update title
    document.getElementById('quickAddTitle').textContent =
        currentLanguage === 'de' ? 'Neue Aufgabe' : 'New Task';

    quickAddModal.style.display = 'flex';
    setTimeout(() => quickAddInput.focus(), 100);
}

// Character counter for quick add
quickAddInput.addEventListener('input', () => {
    const length = quickAddInput.value.length;
    quickAddCharCount.textContent = `${length}/140`;

    quickAddCharCount.classList.remove('warning', 'error');
    if (length > 120) {
        quickAddCharCount.classList.add('warning');
    }
    if (length >= 140) {
        quickAddCharCount.classList.add('error');
    }

    // Enable/disable submit button
    quickAddSubmitBtn.disabled = length === 0 || length > 140;
});

// Quick add recurring toggle
quickRecurringEnabled.addEventListener('change', () => {
    quickRecurringOptions.style.display = quickRecurringEnabled.checked ? 'block' : 'none';
});

// Quick add recurring type changes
document.querySelectorAll('input[name="quickRecurringType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        // Hide all sub-options
        document.getElementById('quickWeekdaysContainer').style.display = 'none';
        document.getElementById('quickMonthDayContainer').style.display = 'none';
        document.getElementById('quickCustomDaysContainer').style.display = 'none';

        // Show relevant sub-option
        if (e.target.value === 'weekly') {
            document.getElementById('quickWeekdaysContainer').style.display = 'flex';
        } else if (e.target.value === 'monthly') {
            document.getElementById('quickMonthDayContainer').style.display = 'block';
        } else if (e.target.value === 'custom') {
            document.getElementById('quickCustomDaysContainer').style.display = 'block';
        }
    });
});

// Submit quick add task
quickAddSubmitBtn.addEventListener('click', () => {
    const taskText = quickAddInput.value.trim();
    if (!taskText || taskText.length > 140) return;

    // Check if recurring
    if (quickRecurringEnabled.checked) {
        const recurringType = document.querySelector('input[name="quickRecurringType"]:checked').value;
        let recurringConfig = { type: recurringType };

        if (recurringType === 'weekly') {
            const weekdays = Array.from(document.querySelectorAll('#quickWeekdaysContainer .weekday-check:checked'))
                .map(cb => parseInt(cb.value));
            if (weekdays.length === 0) {
                alert(currentLanguage === 'de' ?
                    'Bitte wähle mindestens einen Wochentag' :
                    'Please select at least one weekday');
                return;
            }
            recurringConfig.weekdays = weekdays;
        } else if (recurringType === 'monthly') {
            recurringConfig.dayOfMonth = parseInt(document.getElementById('quickMonthDay').value) || 1;
        } else if (recurringType === 'custom') {
            recurringConfig.intervalDays = parseInt(document.getElementById('quickCustomDays').value) || 1;
        }

        addTaskToSegmentWithRecurring(taskText, currentQuickAddSegment, recurringConfig);
    } else {
        addTaskToSegment(taskText, currentQuickAddSegment);
    }

    quickAddModal.style.display = 'none';
});

// Cancel quick add
quickAddCancelBtn.addEventListener('click', () => {
    quickAddModal.style.display = 'none';
});

// Close modal on outside click
quickAddModal.addEventListener('click', (e) => {
    if (e.target === quickAddModal) {
        quickAddModal.style.display = 'none';
    }
});

// Enter key submits
quickAddInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !quickAddSubmitBtn.disabled) {
        quickAddSubmitBtn.click();
    }
});

// Helper function for recurring tasks
function addTaskToSegmentWithRecurring(text, segmentId, recurringConfig) {
    const task = {
        id: Date.now(),
        text: text,
        segment: segmentId,
        completed: false,
        createdAt: new Date().toISOString(),
        recurring: recurringConfig
    };
    tasks.push(task);
    saveTasks();
    renderAllTasks();
}

// Footer Settings Button (v1.4.5)
const settingsBtnFooter = document.getElementById('settingsBtnFooter');
if (settingsBtnFooter) {
    settingsBtnFooter.addEventListener('click', () => {
        openSettingsModal();
    });
}

// Functions
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        taskInput.focus();
        return;
    }

    currentTask = taskText;
    openModal();
    taskInput.value = '';
}

function addTaskToSegment(taskText, segmentId, recurringConfig = null) {
    const task = {
        id: Date.now(),
        text: taskText,
        segment: segmentId,
        checked: false,
        createdAt: Date.now(),
        completedAt: null
    };

    // Add recurring configuration if enabled
    if (recurringConfig && recurringConfig.enabled) {
        task.recurring = {
            enabled: true,
            interval: recurringConfig.interval,
            weekdays: recurringConfig.weekdays || [],
            dayOfMonth: recurringConfig.dayOfMonth || 1,
            customDays: recurringConfig.customDays || 1
        };
    }

    tasks[segmentId].push(task);

    // Save to Firestore if user is logged in, otherwise to localStorage
    if (currentUser) {
        saveTaskToFirestore(task);
    } else {
        saveGuestTasks(); // Save to localStorage (guest mode)
    }

    renderSegment(segmentId);
}

function moveTask(taskId, fromSegment) {
    const taskIndex = tasks[fromSegment].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[fromSegment][taskIndex];
    currentTask = { ...task, fromSegment };

    openModalForMove();
}

function openModalForMove() {
    modal.classList.add('active');

    // Update segment buttons for move
    segmentBtns.forEach(btn => {
        const segmentId = parseInt(btn.dataset.segment);
        btn.onclick = () => {
            if (currentTask.fromSegment !== segmentId) {
                // Remove from old segment
                tasks[currentTask.fromSegment] = tasks[currentTask.fromSegment].filter(
                    t => t.id !== currentTask.id
                );

                // Add to new segment
                const task = {
                    id: currentTask.id,
                    text: currentTask.text,
                    segment: segmentId,
                    checked: false
                };
                
                // Clear completedAt when moving away from Done segment
                if (currentTask.fromSegment === 5) {
                    // Don't include completedAt
                } else if (currentTask.completedAt) {
                    task.completedAt = currentTask.completedAt;
                }
                
                tasks[segmentId].push(task);

                saveTasks();
                renderSegment(currentTask.fromSegment);
                renderSegment(segmentId);
            }
            currentTask = null;
            closeModal();
        };
    });
}

function toggleTask(taskId, segmentId) {
    const taskIndex = tasks[segmentId].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[segmentId][taskIndex];

    if (!task.checked && segmentId !== 5) {
        // Check if this is a recurring task
        if (task.recurring && task.recurring.enabled) {
            // Create a new instance of the recurring task
            const newTask = {
                id: Date.now(),
                text: task.text,
                segment: task.segment,
                checked: false,
                recurring: { ...task.recurring }
            };
            
            // Add the new task to the same segment
            tasks[segmentId].push(newTask);
            
            if (currentUser) {
                saveTaskToFirestore(newTask);
            } else {
                saveGuestTasks();
            }
        }
        
        // Move to Done segment (5)
        tasks[segmentId].splice(taskIndex, 1);

        task.segment = 5;
        task.checked = true;
        task.completedAt = Date.now(); // Track completion time for productivity statistics
        tasks[5].push(task);

        if (currentUser) {
            updateTaskInFirestore(task);
        } else {
            saveTasks();
        }

        renderSegment(segmentId);
        renderSegment(5);
    } else if (task.checked && segmentId === 5) {
        // Restore from Done segment to segment 1
        tasks[segmentId].splice(taskIndex, 1);

        task.segment = 1;
        task.checked = false;
        task.completedAt = null; // Reset completion time for productivity statistics
        tasks[1].push(task);

        if (currentUser) {
            updateTaskInFirestore(task);
        } else {
            saveTasks();
        }

        renderSegment(5);
        renderSegment(1);
    }
}

function deleteTask(taskId, segmentId) {
    if (confirm('Aufgabe wirklich löschen?')) {
        tasks[segmentId] = tasks[segmentId].filter(t => t.id !== taskId);

        if (currentUser) {
            deleteTaskFromFirestore(taskId);
        } else {
            saveTasks();
        }

        renderSegment(segmentId);
    }
}

function renderSegment(segmentId) {
    const segmentElement = document.getElementById(`segment${segmentId}`);
    segmentElement.innerHTML = '';

    tasks[segmentId].forEach(task => {
        const taskElement = createTaskElement(task);
        segmentElement.appendChild(taskElement);
    });
}

function renderAllTasks() {
    for (let i = 1; i <= 5; i++) {
        renderSegment(i);
    }
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.draggable = true;
    div.dataset.taskId = task.id;
    div.dataset.segmentId = task.segment;

    // Set border color based on segment
    const colors = {
        1: '#ef4444',
        2: '#10b981',
        3: '#f59e0b',
        4: '#6b7280',
        5: '#8b5cf6'
    };
    div.style.setProperty('--checkbox-color', colors[task.segment]);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.checked;

    // Checkbox event listener for all segments
    checkbox.addEventListener('change', () => {
        toggleTask(task.id, task.segment);
    });

    const content = document.createElement('div');
    content.className = 'task-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    
    // Create a text node for the task text
    const textNode = document.createTextNode(task.text);
    textSpan.appendChild(textNode);
    
    // Add recurring indicator if task is recurring
    if (task.recurring && task.recurring.enabled) {
        const recurringIndicator = document.createElement('span');
        recurringIndicator.className = 'recurring-indicator';
        recurringIndicator.textContent = ' ' + translations[currentLanguage].recurring.indicator;
        recurringIndicator.title = getRecurringDescription(task.recurring);
        textSpan.appendChild(recurringIndicator);
    }

    content.appendChild(textSpan);

    // Add completion timestamp for Done! segment
    if (task.segment === 5 && task.completedAt) {
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'task-timestamp';
        const date = new Date(task.completedAt);
        const formattedDate = date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        timestampSpan.textContent = `${formattedDate} ${formattedTime}`;
        content.appendChild(timestampSpan);
    }

    div.appendChild(checkbox);
    div.appendChild(content);

    // Drag and Drop Events (Desktop)
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    // Touch Drag and Drop (Mobile)
    setupTouchDrag(div, task);

    // Swipe to Delete
    setupSwipeToDelete(div, task);

    return div;
}

function getRecurringDescription(recurring) {
    const lang = translations[currentLanguage].recurring;
    
    switch(recurring.interval) {
        case 'daily':
            return lang.daily;
        case 'weekly':
            return lang.weekly;
        case 'monthly':
            return `${lang.monthly} (${lang.dayOfMonth} ${recurring.dayOfMonth})`;
        case 'custom':
            return `${lang.custom} (${recurring.customDays} ${lang.customDays})`;
        default:
            return lang.custom;
    }
}

function openModal() {
    modal.classList.add('active');
    
    // Reset recurring task options
    recurringEnabled.checked = false;
    recurringOptions.style.display = 'none';
    recurringInterval.value = 'daily';
    weeklyOptions.style.display = 'none';
    monthlyOptions.style.display = 'none';
    customOptions.style.display = 'none';
    
    // Reset weekday checkboxes
    const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]');
    weekdayCheckboxes.forEach(cb => cb.checked = false);

    // Reset segment buttons to normal add functionality
    segmentBtns.forEach(btn => {
        const segmentId = parseInt(btn.dataset.segment);
        btn.onclick = () => {
            if (currentTask) {
                // Get recurring configuration if enabled
                const recurringConfig = getRecurringConfig();
                addTaskToSegment(currentTask, segmentId, recurringConfig);
                currentTask = null;
            }
            closeModal();
        };
    });
}

function getRecurringConfig() {
    if (!recurringEnabled.checked) {
        return null;
    }
    
    const config = {
        enabled: true,
        interval: recurringInterval.value
    };
    
    // Get interval-specific configuration
    switch(config.interval) {
        case 'weekly':
            const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]:checked');
            config.weekdays = Array.from(weekdayCheckboxes).map(cb => parseInt(cb.value));
            break;
        case 'monthly':
            config.dayOfMonth = parseInt(document.getElementById('dayOfMonth').value);
            break;
        case 'custom':
            config.customDays = parseInt(document.getElementById('customDays').value);
            break;
    }
    
    return config;
}

function closeModal() {
    modal.classList.remove('active');
    currentTask = null;
}

function saveTasks() {
    // Use guest mode saving if in guest mode (delegates to localForage)
    if (typeof isGuestMode !== 'undefined' && isGuestMode) {
        saveGuestTasks();
    }
    // If logged in, tasks are saved to Firestore automatically
}

// Drag and Drop Functions
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';

    // Remove all drag-over styles
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });

    // Reset dragged element
    draggedElement = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (e.target.classList.contains('task-list')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('task-list')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (!draggedElement) {
        return false;
    }

    const taskId = parseInt(draggedElement.dataset.taskId);
    const fromSegment = parseInt(draggedElement.dataset.segmentId);
    const toSegment = parseInt(e.currentTarget.dataset.segment);

    if (fromSegment !== toSegment) {
        // Find the task
        const taskIndex = tasks[fromSegment].findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            const task = tasks[fromSegment][taskIndex];

            // Remove from old segment
            tasks[fromSegment].splice(taskIndex, 1);

            // Add to new segment
            task.segment = toSegment;
            // Reset checked status when moving to segments 1-4
            if (toSegment !== 5) {
                task.checked = false;
                delete task.completedAt;
            } else if (toSegment === 5 && !task.completedAt) {
                // Set completion time when moving to Done segment
                task.completedAt = new Date().toISOString();
            }
            tasks[toSegment].push(task);

            if (currentUser) {
                updateTaskInFirestore(task);
            } else {
                saveTasks();
            }

            renderSegment(fromSegment);
            renderSegment(toSegment);
        }
    }

    e.currentTarget.classList.remove('drag-over');
    return false;
}

function setupDragAndDrop() {
    const taskLists = document.querySelectorAll('.task-list');

    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver, false);
        list.addEventListener('dragenter', handleDragEnter, false);
        list.addEventListener('dragleave', handleDragLeave, false);
        list.addEventListener('drop', handleDrop, false);
    });
}

// Touch Drag and Drop for Mobile
function setupTouchDrag(element, task) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    let isSwipeDelete = false;
    let dragClone = null;
    let dropTarget = null;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = false;
        isSwipeDelete = false;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        touchCurrentX = e.touches[0].clientX;
        touchCurrentY = e.touches[0].clientY;

        const diffX = touchCurrentX - touchStartX;
        const diffY = touchCurrentY - touchStartY;

        // Determine if this is a drag (vertical) or swipe delete (horizontal)
        if (!isDragging && !isSwipeDelete) {
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
                // Vertical movement - start dragging
                isDragging = true;
                e.preventDefault();

                // Create visual clone for dragging
                dragClone = element.cloneNode(true);
                dragClone.style.position = 'fixed';
                dragClone.style.width = element.offsetWidth + 'px';
                dragClone.style.opacity = '0.8';
                dragClone.style.zIndex = '1000';
                dragClone.style.pointerEvents = 'none';
                dragClone.style.transform = 'scale(1.05)';
                document.body.appendChild(dragClone);

                // Dim the original
                element.style.opacity = '0.3';
            } else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && Math.abs(diffX) > 10) {
                // Horizontal left swipe - delete gesture
                isSwipeDelete = true;
            }
        }

        if (isDragging && dragClone) {
            e.preventDefault();

            // Update clone position
            dragClone.style.left = (touchCurrentX - element.offsetWidth / 2) + 'px';
            dragClone.style.top = (touchCurrentY - 30) + 'px';

            // Find drop target
            const elementsBelow = document.elementsFromPoint(touchCurrentX, touchCurrentY);
            const taskListBelow = elementsBelow.find(el => el.classList.contains('task-list'));

            // Remove previous highlights
            document.querySelectorAll('.task-list').forEach(list => {
                list.classList.remove('drag-over');
            });

            if (taskListBelow) {
                dropTarget = taskListBelow;
                taskListBelow.classList.add('drag-over');
            }
        } else if (isSwipeDelete) {
            // Allow swipe delete to work (handled by setupSwipeToDelete)
            element.style.transform = `translateX(${diffX}px)`;
            element.style.opacity = 1 + (diffX / 300);
        }
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (isDragging && dragClone) {
            e.preventDefault();

            // Remove clone
            document.body.removeChild(dragClone);
            dragClone = null;

            // Reset original opacity
            element.style.opacity = '1';

            // Handle drop
            if (dropTarget) {
                const toSegment = parseInt(dropTarget.dataset.segment);
                const fromSegment = task.segment;

                if (fromSegment !== toSegment) {
                    // Move task
                    const taskIndex = tasks[fromSegment].findIndex(t => t.id === task.id);
                    if (taskIndex !== -1) {
                        const movedTask = tasks[fromSegment][taskIndex];

                        // Remove from old segment
                        tasks[fromSegment].splice(taskIndex, 1);

                        // Add to new segment
                        movedTask.segment = toSegment;
                        if (toSegment !== 5) {
                            movedTask.checked = false;
                        }
                        tasks[toSegment].push(movedTask);

                        if (currentUser) {
                            updateTaskInFirestore(movedTask);
                        } else {
                            saveTasks();
                        }

                        renderSegment(fromSegment);
                        renderSegment(toSegment);
                    }
                }

                dropTarget.classList.remove('drag-over');
                dropTarget = null;
            }

            // Remove all highlights
            document.querySelectorAll('.task-list').forEach(list => {
                list.classList.remove('drag-over');
            });
        } else if (isSwipeDelete) {
            const diffX = touchCurrentX - touchStartX;

            // Delete if swiped more than 100px to the left
            if (diffX < -100) {
                element.style.transform = 'translateX(-300px)';
                element.style.opacity = '0';
                setTimeout(() => {
                    deleteTask(task.id, task.segment);
                }, 300);
            } else {
                // Reset
                element.style.transform = '';
                element.style.opacity = '';
            }
        }

        isDragging = false;
        isSwipeDelete = false;
    });
}

// Swipe to Delete Functionality (Simplified - now integrated with touch drag)
function setupSwipeToDelete(element, task) {
    // This is now handled in setupTouchDrag to avoid conflicts
    // Keeping this function for compatibility but it's empty
}

// Pull to Refresh removed - users can refresh manually using browser refresh

// Online/Offline Status
function updateOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (!indicator) return;

    if (!navigator.onLine) {
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

// Settings Modal Functions
function openSettingsModal() {
    const settingsUserInfo = document.getElementById('settingsUserInfo');
    const settingsVersion = document.getElementById('settingsVersion');

    if (currentUser) {
        settingsUserInfo.textContent = `Angemeldet als: ${currentUser.email}`;
    } else {
        settingsUserInfo.textContent = 'Nicht angemeldet (Lokaler Modus)';
    }

    settingsVersion.textContent = `Version ${APP_VERSION} (${BUILD_DATE})`;

    settingsModal.classList.add('active');
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

// Sign Out Function
async function signOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut().then(() => {
            location.reload();
        }).catch((error) => {
            console.error('Logout Error:', error);
            alert('Fehler beim Abmelden: ' + error.message);
        });
    } else {
        // Guest mode: clear IndexedDB and reload
        await localforage.clear();
        location.reload();
    }
}

// Export Data
function exportData() {
    const exportData = {
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        tasks: tasks
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eisenhauer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Daten erfolgreich exportiert!');
}

// Import Data
function importData(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate data structure
            if (!importedData.tasks) {
                throw new Error('Ungültiges Datenformat');
            }

            if (confirm('Möchtest du die importierten Daten mit den aktuellen Daten zusammenführen? (Abbrechen = Aktuelle Daten ersetzen)')) {
                // Merge: Add imported tasks to existing ones
                Object.keys(importedData.tasks).forEach(segmentId => {
                    importedData.tasks[segmentId].forEach(task => {
                        // Generate new ID to avoid conflicts
                        task.id = Date.now() + Math.random();
                        tasks[segmentId].push(task);
                    });
                });
            } else {
                // Replace: Overwrite existing tasks
                tasks = importedData.tasks;
            }

            // Save and render
            if (currentUser) {
                // Save all tasks to Firestore
                Object.keys(tasks).forEach(segmentId => {
                    tasks[segmentId].forEach(task => {
                        saveTaskToFirestore(task);
                    });
                });
            } else {
                saveTasks();
            }

            renderAllTasks();
            alert('Daten erfolgreich importiert!');
        } catch (error) {
            console.error('Import Error:', error);
            alert('Fehler beim Importieren: ' + error.message);
        }
    };

    reader.readAsText(file);
}

// Escape HTML utility to prevent XSS when dynamically setting innerHTML
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (m) {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return m;
        }
    });
}

// Filter Tasks (Search)
function filterTasks(searchTerm) {
    const allTaskElements = document.querySelectorAll('.task-item');

    if (!searchTerm) {
        // Show all tasks, remove highlights
        allTaskElements.forEach(el => {
            el.style.display = '';
            const textSpan = el.querySelector('.task-text');
            if (textSpan) {
                // Remove highlights
                textSpan.textContent = textSpan.textContent;
            }
        });
        return;
    }

    allTaskElements.forEach(el => {
        const textSpan = el.querySelector('.task-text');
        if (!textSpan) return;

        const taskText = textSpan.textContent.toLowerCase();

        if (taskText.includes(searchTerm)) {
            el.style.display = '';

            // Highlight search term
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            // Escape HTML and highlight search term
            const originalText = textSpan.textContent;
            let highlightedText = '';
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(originalText)) !== null) {
                // Escape preceding text
                highlightedText += escapeHTML(originalText.substring(lastIndex, match.index));
                // Escape and wrap the matched text
                highlightedText += `<span class="search-highlight">${escapeHTML(match[0])}</span>`;
                lastIndex = regex.lastIndex;
            }
            // Escape remaining text after the last match
            highlightedText += escapeHTML(originalText.substring(lastIndex));
            textSpan.innerHTML = highlightedText;
        } else {
            el.style.display = 'none';
            // Remove highlights
            textSpan.textContent = textSpan.textContent;
        }
    });
}

// Update Language
function updateLanguage() {
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
    segmentButtons.forEach((btn, index) => {
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
    if (taskInput) {
        taskInput.placeholder = lang.taskInputPlaceholder;
    }

    // Update drag hint text
    const dragHint = document.getElementById('dragHint');
    if (dragHint) {
        const hintText = currentLanguage === 'de'
            ? '💡 <strong>Tipp:</strong> Ziehe Aufgaben zwischen Kategorien, um sie zu verschieben. Wische nach links, um zu löschen.'
            : '💡 <strong>Tip:</strong> Drag tasks between categories to move them. Swipe left to delete.';
        dragHint.querySelector('p').innerHTML = hintText;

        const btnText = currentLanguage === 'de' ? 'Verstanden' : 'Got it';
        dragHint.querySelector('button').textContent = btnText;
    }
    
    // Re-render all tasks to update recurring indicators
    renderAllTasks();
    
    // Update metrics modal
    updateMetricsLanguage();
}

function updateMetricsLanguage() {
    const lang = translations[currentLanguage];
    if (!lang.metrics) return;
    
    const metricsTitle = document.getElementById('metricsTitle');
    if (metricsTitle) metricsTitle.textContent = lang.metrics.title;
    
    const metricsOverviewTitle = document.getElementById('metricsOverviewTitle');
    if (metricsOverviewTitle) metricsOverviewTitle.textContent = lang.metrics.overview;
    
    const metricTotalLabel = document.getElementById('metricTotalLabel');
    if (metricTotalLabel) metricTotalLabel.textContent = lang.metrics.totalCompleted;
    
    const metricStreakLabel = document.getElementById('metricStreakLabel');
    if (metricStreakLabel) metricStreakLabel.textContent = lang.metrics.streak;
    
    const metricAvgTimeLabel = document.getElementById('metricAvgTimeLabel');
    if (metricAvgTimeLabel) metricStreakLabel.textContent = lang.metrics.avgTime;
    
    const metricsCompletedTitle = document.getElementById('metricsCompletedTitle');
    if (metricsCompletedTitle) metricsCompletedTitle.textContent = lang.metrics.completedTasks;
    
    const metricsDistributionTitle = document.getElementById('metricsDistributionTitle');
    if (metricsDistributionTitle) metricsDistributionTitle.textContent = lang.metrics.distribution;
    
    const metricsDayBtn = document.getElementById('metricsDayBtn');
    if (metricsDayBtn) metricsDayBtn.textContent = lang.metrics.day;
    
    const metricsWeekBtn = document.getElementById('metricsWeekBtn');
    if (metricsWeekBtn) metricsWeekBtn.textContent = lang.metrics.week;
    
    const metricsMonthBtn = document.getElementById('metricsMonthBtn');
    if (metricsMonthBtn) metricsMonthBtn.textContent = lang.metrics.month;
    
    const metricsCancelBtn = document.getElementById('metricsCancelBtn');
    if (metricsCancelBtn) metricsCancelBtn.textContent = lang.metrics.close;
}

// Show Drag Hint
function showDragHint() {
    const dragHint = document.getElementById('dragHint');
    if (dragHint) {
        dragHint.style.display = 'block';

        const closeBtn = document.getElementById('closeDragHint');
        closeBtn.addEventListener('click', async () => {
            dragHint.style.display = 'none';
            await localforage.setItem('dragHintSeen', true);
        });
    }
}

// Metrics Modal Functions
let completedTasksChart = null;
let segmentDistributionChart = null;
let currentChartPeriod = 'day';

function openMetricsModal() {
    metricsModal.classList.add('active');
    calculateAndDisplayMetrics();
}

function closeMetricsModal() {
    metricsModal.classList.remove('active');
}

function calculateAndDisplayMetrics() {
    const completedTasks = tasks[5] || [];
    
    // Calculate total completed tasks
    const totalCompleted = completedTasks.length;
    document.getElementById('metricTotalCompleted').textContent = totalCompleted;
    
    // Calculate streak
    const streak = calculateStreak(completedTasks);
    document.getElementById('metricCurrentStreak').textContent = streak;
    
    // Calculate average processing time
    const avgTime = calculateAverageProcessingTime(completedTasks);
    document.getElementById('metricAvgTime').textContent = avgTime;
    
    // Create charts
    createCompletedTasksChart(completedTasks, currentChartPeriod);
    createSegmentDistributionChart();
    
    // Setup chart period buttons
    setupChartPeriodButtons();
}

function calculateStreak(completedTasks) {
    if (completedTasks.length === 0) return 0;
    
    // Get tasks with completion dates, sorted by date (newest first)
    const tasksWithDates = completedTasks
        .filter(t => t.completedAt)
        .sort((a, b) => b.completedAt - a.completedAt);
    
    if (tasksWithDates.length === 0) return 0;
    
    // Get unique days with completed tasks
    const completedDays = new Set();
    tasksWithDates.forEach(task => {
        const date = new Date(task.completedAt);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        completedDays.add(dayKey);
    });
    
    const sortedDays = Array.from(completedDays).sort().reverse();
    
    // Calculate streak from today backwards
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) { // Max 1 year
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        
        if (sortedDays.includes(dateKey)) {
            streak++;
        } else if (i > 0) { // Allow today to be missing
            break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

function calculateAverageProcessingTime(completedTasks) {
    const tasksWithTime = completedTasks.filter(t => t.createdAt && t.completedAt);
    
    if (tasksWithTime.length === 0) return '-';
    
    const totalTime = tasksWithTime.reduce((sum, task) => {
        return sum + (task.completedAt - task.createdAt);
    }, 0);
    
    const avgMs = totalTime / tasksWithTime.length;
    
    // Convert to human readable format
    const hours = Math.floor(avgMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        const minutes = Math.floor(avgMs / (1000 * 60));
        return `${minutes}m`;
    }
}

function createCompletedTasksChart(completedTasks, period) {
    const ctx = document.getElementById('completedTasksChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (completedTasksChart) {
        completedTasksChart.destroy();
    }
    
    const data = getCompletedTasksData(completedTasks, period);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#f9fafb' : '#1f2937';
    const gridColor = isDarkMode ? '#404040' : '#e5e7eb';
    
    const lang = translations[currentLanguage];
    
    completedTasksChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: lang.metrics.chartLabel,
                data: data.values,
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function getCompletedTasksData(completedTasks, period) {
    const now = new Date();
    const labels = [];
    const values = [];
    
    if (period === 'day') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
            labels.push(dayName);
            
            const count = completedTasks.filter(task => {
                if (!task.completedAt) return false;
                const taskDate = new Date(task.completedAt);
                return taskDate.toDateString() === date.toDateString();
            }).length;
            
            values.push(count);
        }
    } else if (period === 'week') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
            labels.push(`KW ${getWeekNumber(weekStart)}`);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const count = completedTasks.filter(task => {
                if (!task.completedAt) return false;
                const taskDate = new Date(task.completedAt);
                return taskDate >= weekStart && taskDate <= weekEnd;
            }).length;
            
            values.push(count);
        }
    } else if (period === 'month') {
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('de-DE', { month: 'short' });
            labels.push(monthName);
            
            const count = completedTasks.filter(task => {
                if (!task.completedAt) return false;
                const taskDate = new Date(task.completedAt);
                return taskDate.getMonth() === date.getMonth() && 
                       taskDate.getFullYear() === date.getFullYear();
            }).length;
            
            values.push(count);
        }
    }
    
    return { labels, values };
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function createSegmentDistributionChart() {
    const ctx = document.getElementById('segmentDistributionChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (segmentDistributionChart) {
        segmentDistributionChart.destroy();
    }
    
    // Count completed tasks by original segment
    const segmentCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };
    
    // Count tasks in Done segment by their origin
    tasks[5].forEach(task => {
        // We don't track original segment, so we'll count current distribution
        // For a better implementation, we should track the original segment
    });
    
    // For now, count all tasks across all segments
    for (let i = 1; i <= 5; i++) {
        if (i < 5 && tasks[i]) {
            segmentCounts[i] = tasks[i].length;
        }
    }
    
    // Also count completed tasks (assuming they came from all segments proportionally)
    const completedCount = tasks[5] ? tasks[5].length : 0;
    const totalActive = segmentCounts[1] + segmentCounts[2] + segmentCounts[3] + segmentCounts[4];
    
    if (totalActive > 0) {
        // Distribute completed tasks proportionally
        for (let i = 1; i <= 4; i++) {
            const proportion = segmentCounts[i] / totalActive;
            segmentCounts[i] += Math.round(completedCount * proportion);
        }
    } else {
        // If no active tasks, distribute evenly
        for (let i = 1; i <= 4; i++) {
            segmentCounts[i] = Math.round(completedCount / 4);
        }
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#f9fafb' : '#1f2937';
    
    const segmentNames = currentLanguage === 'de' 
        ? ['Sofort!', 'Planen!', 'Abgeben!', 'Später!']
        : ['Do!', 'Schedule!', 'Delegate!', 'Ignore!'];
    
    segmentDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: segmentNames,
            datasets: [{
                data: [segmentCounts[1], segmentCounts[2], segmentCounts[3], segmentCounts[4]],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(107, 114, 128, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15
                    }
                }
            }
        }
    });
}

function setupChartPeriodButtons() {
    const periodButtons = document.querySelectorAll('.chart-period-btn');
    
    periodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            periodButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update chart period and redraw
            currentChartPeriod = btn.dataset.period;
            const completedTasks = tasks[5] || [];
            createCompletedTasksChart(completedTasks, currentChartPeriod);
        });
    });
}
