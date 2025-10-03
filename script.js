// App Version
const APP_VERSION = 'v1.1.0';

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
const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('segmentModal');
const cancelBtn = document.getElementById('cancelBtn');
const segmentBtns = document.querySelectorAll('.segment-btn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsCancelBtn = document.getElementById('settingsCancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Display version number
    const versionElement = document.getElementById('versionNumber');
    if (versionElement) {
        versionElement.textContent = APP_VERSION;
    }

    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    renderAllTasks();
    setupDragAndDrop();
    setupPullToRefresh();
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

// Add Task Button Click
addTaskBtn.addEventListener('click', addTask);

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
settingsBtn.addEventListener('click', () => {
    openSettingsModal();
});

// Settings Cancel Button
settingsCancelBtn.addEventListener('click', () => {
    closeSettingsModal();
});

// Settings modal background click
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettingsModal();
    }
});

// Logout Button
logoutBtn.addEventListener('click', () => {
    if (confirm('Möchtest du dich wirklich abmelden?')) {
        signOut();
    }
});

// Dark Mode Toggle
darkModeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
});

// Search Input
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterTasks(searchTerm);
});

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

function addTaskToSegment(taskText, segmentId) {
    const task = {
        id: Date.now(),
        text: taskText,
        segment: segmentId,
        checked: false
    };

    tasks[segmentId].push(task);

    // Save to Firestore if user is logged in
    if (currentUser) {
        saveTaskToFirestore(task);
    } else {
        saveTasks(); // Fallback to localStorage
    }

    renderSegment(segmentId);
}

function moveTaskDown(taskId, fromSegment) {
    const taskIndex = tasks[fromSegment].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Determine next segment: 1->2->3->4->5
    const nextSegment = fromSegment < 4 ? fromSegment + 1 : 5;

    const task = tasks[fromSegment][taskIndex];

    // Remove from current segment
    tasks[fromSegment].splice(taskIndex, 1);

    // Add to next segment
    task.segment = nextSegment;
    task.checked = nextSegment === 5;
    tasks[nextSegment].push(task);

    if (currentUser) {
        updateTaskInFirestore(task);
    } else {
        saveTasks();
    }

    renderSegment(fromSegment);
    renderSegment(nextSegment);
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

    // Move to Done segment (5)
    if (!task.checked && segmentId !== 5) {
        // Remove from current segment
        tasks[segmentId].splice(taskIndex, 1);

        // Add to Done segment
        task.segment = 5;
        task.checked = true;
        tasks[5].push(task);

        if (currentUser) {
            updateTaskInFirestore(task);
        } else {
            saveTasks();
        }

        renderSegment(segmentId);
        renderSegment(5);
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

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.checked;

    // Only enable checkbox for segments 1-4
    if (task.segment !== 5) {
        checkbox.addEventListener('change', () => {
            toggleTask(task.id, task.segment);
        });
    }

    const content = document.createElement('div');
    content.className = 'task-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Only show move button for segments 1-4
    if (task.segment !== 5) {
        const moveBtn = document.createElement('button');
        moveBtn.className = 'move-btn';
        moveBtn.textContent = '↓';
        moveBtn.title = 'In nächste Kategorie verschieben';
        moveBtn.addEventListener('click', () => {
            moveTaskDown(task.id, task.segment);
        });
        actions.appendChild(moveBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id, task.segment);
    });
    actions.appendChild(deleteBtn);

    content.appendChild(textSpan);
    content.appendChild(actions);

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

function openModal() {
    modal.classList.add('active');

    // Reset segment buttons to normal add functionality
    segmentBtns.forEach(btn => {
        const segmentId = parseInt(btn.dataset.segment);
        btn.onclick = () => {
            if (currentTask) {
                addTaskToSegment(currentTask, segmentId);
                currentTask = null;
            }
            closeModal();
        };
    });
}

function closeModal() {
    modal.classList.remove('active');
    currentTask = null;
}

function saveTasks() {
    // Fallback to localStorage when not logged in
    localStorage.setItem('eisenhauerTasks', JSON.stringify(tasks));
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
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (!draggedElement) return false;

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

// Pull to Refresh
function setupPullToRefresh() {
    const segments = document.querySelector('.segments');
    if (!segments) return;

    let startY = 0;
    let pulling = false;

    segments.addEventListener('touchstart', (e) => {
        if (segments.scrollTop === 0) {
            startY = e.touches[0].clientY;
        }
    }, { passive: true });

    segments.addEventListener('touchmove', (e) => {
        if (segments.scrollTop === 0) {
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 0 && diff < 100) {
                pulling = true;
                segments.style.transform = `translateY(${diff / 2}px)`;
                segments.style.opacity = 1 - (diff / 200);
            }
        }
    }, { passive: true });

    segments.addEventListener('touchend', async () => {
        if (pulling) {
            segments.style.transform = '';
            segments.style.opacity = '';

            // Reload tasks
            if (currentUser) {
                await loadUserTasks();
            }

            pulling = false;
        }
    });
}

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
    if (currentUser) {
        settingsUserInfo.textContent = `Angemeldet als: ${currentUser.email}`;
    } else {
        settingsUserInfo.textContent = 'Nicht angemeldet (Lokaler Modus)';
    }
    settingsModal.classList.add('active');
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

// Sign Out Function
function signOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut().then(() => {
            location.reload();
        }).catch((error) => {
            console.error('Logout Error:', error);
            alert('Fehler beim Abmelden: ' + error.message);
        });
    } else {
        // Local mode: just clear localStorage and reload
        localStorage.clear();
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
                textSpan.innerHTML = textSpan.textContent;
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
            const highlightedText = textSpan.textContent.replace(regex, '<span class="search-highlight">$1</span>');
            textSpan.innerHTML = highlightedText;
        } else {
            el.style.display = 'none';
            // Remove highlights
            textSpan.innerHTML = textSpan.textContent;
        }
    });
}
