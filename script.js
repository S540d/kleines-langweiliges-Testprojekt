// Task Management
let tasks = JSON.parse(localStorage.getItem('eisenhauerTasks')) || {
    1: [],
    2: [],
    3: [],
    4: []
};

let currentTask = null;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('quadrantModal');
const cancelBtn = document.getElementById('cancelBtn');
const quadrantBtns = document.querySelectorAll('.quadrant-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAllTasks();
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

// Quadrant Selection Buttons
quadrantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const quadrantId = parseInt(btn.dataset.quadrant);
        if (currentTask) {
            addTaskToQuadrant(currentTask, quadrantId);
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

function addTaskToQuadrant(taskText, quadrantId) {
    const task = {
        id: Date.now(),
        text: taskText,
        quadrant: quadrantId
    };

    tasks[quadrantId].push(task);
    saveTasks();
    renderQuadrant(quadrantId);
}

function moveTask(taskId, fromQuadrant) {
    const taskIndex = tasks[fromQuadrant].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[fromQuadrant][taskIndex];
    currentTask = { ...task, fromQuadrant };

    openModalForMove();
}

function openModalForMove() {
    modal.classList.add('active');

    // Update quadrant buttons for move
    quadrantBtns.forEach(btn => {
        const quadrantId = parseInt(btn.dataset.quadrant);
        btn.onclick = () => {
            if (currentTask.fromQuadrant !== quadrantId) {
                // Remove from old quadrant
                tasks[currentTask.fromQuadrant] = tasks[currentTask.fromQuadrant].filter(
                    t => t.id !== currentTask.id
                );

                // Add to new quadrant
                const task = {
                    id: currentTask.id,
                    text: currentTask.text,
                    quadrant: quadrantId
                };
                tasks[quadrantId].push(task);

                saveTasks();
                renderQuadrant(currentTask.fromQuadrant);
                renderQuadrant(quadrantId);
            }
            currentTask = null;
            closeModal();
        };
    });
}

function deleteTask(taskId, quadrantId) {
    if (confirm('Aufgabe wirklich löschen?')) {
        tasks[quadrantId] = tasks[quadrantId].filter(t => t.id !== taskId);
        saveTasks();
        renderQuadrant(quadrantId);
    }
}

function renderQuadrant(quadrantId) {
    const quadrantElement = document.getElementById(`quadrant${quadrantId}`);
    quadrantElement.innerHTML = '';

    tasks[quadrantId].forEach(task => {
        const taskElement = createTaskElement(task);
        quadrantElement.appendChild(taskElement);
    });
}

function renderAllTasks() {
    for (let i = 1; i <= 4; i++) {
        renderQuadrant(i);
    }
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.draggable = true;

    div.innerHTML = `
        <span class="task-text">${escapeHtml(task.text)}</span>
        <div class="task-actions">
            <button class="move-btn" onclick="moveTask(${task.id}, ${task.quadrant})">Verschieben</button>
            <button class="delete-btn" onclick="deleteTask(${task.id}, ${task.quadrant})">Löschen</button>
        </div>
    `;

    // Drag and Drop
    div.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({
            taskId: task.id,
            fromQuadrant: task.quadrant
        }));
        div.style.opacity = '0.5';
    });

    div.addEventListener('dragend', () => {
        div.style.opacity = '1';
    });

    return div;
}

// Drag and Drop for Quadrants
document.querySelectorAll('.task-list').forEach((quadrantList, index) => {
    const quadrantId = index + 1;

    quadrantList.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        quadrantList.style.background = '#e0e7ff';
    });

    quadrantList.addEventListener('dragleave', () => {
        quadrantList.style.background = '';
    });

    quadrantList.addEventListener('drop', (e) => {
        e.preventDefault();
        quadrantList.style.background = '';

        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { taskId, fromQuadrant } = data;

        if (fromQuadrant !== quadrantId) {
            // Remove from old quadrant
            const taskIndex = tasks[fromQuadrant].findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                const task = tasks[fromQuadrant][taskIndex];
                tasks[fromQuadrant].splice(taskIndex, 1);

                // Add to new quadrant
                task.quadrant = quadrantId;
                tasks[quadrantId].push(task);

                saveTasks();
                renderQuadrant(fromQuadrant);
                renderQuadrant(quadrantId);
            }
        }
    });
});

function openModal() {
    modal.classList.add('active');

    // Reset quadrant buttons to normal add functionality
    quadrantBtns.forEach(btn => {
        const quadrantId = parseInt(btn.dataset.quadrant);
        btn.onclick = () => {
            if (currentTask) {
                addTaskToQuadrant(currentTask, quadrantId);
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
    localStorage.setItem('eisenhauerTasks', JSON.stringify(tasks));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
