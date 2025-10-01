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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAllTasks();
    setupDragAndDrop();
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
        moveBtn.textContent = '↔';
        moveBtn.addEventListener('click', () => {
            moveTask(task.id, task.segment);
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

    // Drag and Drop Events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
