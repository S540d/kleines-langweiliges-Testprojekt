// Authentication Logic
let currentUser = null;

// Auth State Observer
auth.onAuthStateChanged(user => {
    currentUser = user;

    if (user) {
        // User is signed in
        console.log('User signed in:', user.email);
        showApp();
        loadUserTasks();
    } else {
        // User is signed out
        console.log('User signed out');
        showLogin();
    }
});

// Google Sign-In
let isSigningIn = false;

async function signInWithGoogle() {
    if (isSigningIn) {
        console.log('Sign-in already in progress');
        return;
    }

    isSigningIn = true;

    try {
        const result = await auth.signInWithPopup(googleProvider);
        console.log('Google sign-in successful:', result.user.email);

        // Optional: Migrate local data on first login
        await migrateLocalData(result.user.uid);
    } catch (error) {
        console.error('Google sign-in error:', error);
        if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
            alert('Fehler beim Anmelden mit Google: ' + error.message);
        }
    } finally {
        isSigningIn = false;
    }
}

// Apple Sign-In
async function signInWithApple() {
    try {
        const result = await auth.signInWithPopup(appleProvider);
        console.log('Apple sign-in successful:', result.user.email);

        // Optional: Migrate local data on first login
        await migrateLocalData(result.user.uid);
    } catch (error) {
        console.error('Apple sign-in error:', error);
        alert('Fehler beim Anmelden mit Apple: ' + error.message);
    }
}

// Sign Out
async function signOut() {
    try {
        await auth.signOut();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Sign-out error:', error);
        alert('Fehler beim Abmelden: ' + error.message);
    }
}

// Load user tasks from Firestore
async function loadUserTasks() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('tasks')
            .get();

        // Clear current tasks
        tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

        // Load tasks from Firestore
        snapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id; // Use Firestore document ID
            tasks[task.segment].push(task);
        });

        renderAllTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Save task to Firestore
async function saveTaskToFirestore(task) {
    if (!currentUser) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('tasks')
            .doc(task.id.toString())
            .set({
                text: task.text,
                segment: task.segment,
                checked: task.checked,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

// Delete task from Firestore
async function deleteTaskFromFirestore(taskId) {
    if (!currentUser) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('tasks')
            .doc(taskId.toString())
            .delete();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Update task in Firestore
async function updateTaskInFirestore(task) {
    if (!currentUser) return;

    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('tasks')
            .doc(task.id.toString())
            .update({
                segment: task.segment,
                checked: task.checked
            });
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Migrate local data to Firestore (one-time on first login)
async function migrateLocalData(userId) {
    const localTasks = localStorage.getItem('eisenhauerTasks');

    if (!localTasks) return;

    try {
        const tasksData = JSON.parse(localTasks);
        const batch = db.batch();

        Object.keys(tasksData).forEach(segmentId => {
            tasksData[segmentId].forEach(task => {
                const docRef = db.collection('users')
                    .doc(userId)
                    .collection('tasks')
                    .doc(task.id.toString());

                batch.set(docRef, {
                    text: task.text,
                    segment: task.segment,
                    checked: task.checked,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        });

        await batch.commit();
        console.log('Local data migrated to Firestore');

        // Clear local storage after migration
        localStorage.removeItem('eisenhauerTasks');
    } catch (error) {
        console.error('Error migrating local data:', error);
    }
}

// UI Functions
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
}

function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';

    // Update user info
    if (currentUser) {
        const userInfo = document.getElementById('userInfo');
        userInfo.textContent = ''; // Clear existing content

        // Create elements safely (prevents XSS)
        const avatar = document.createElement('img');
        avatar.src = currentUser.photoURL || 'icons/icon-72x72.png';
        avatar.alt = 'User';
        avatar.className = 'user-avatar';

        const email = document.createElement('span');
        email.className = 'user-email';
        email.textContent = currentUser.email || 'User';

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.textContent = 'Abmelden';
        logoutBtn.onclick = signOut;

        userInfo.appendChild(avatar);
        userInfo.appendChild(email);
        userInfo.appendChild(logoutBtn);
    }
}
