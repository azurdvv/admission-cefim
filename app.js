// Sélection des éléments du DOM
const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchBar = document.getElementById('search-bar');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

// Chargement depuis le LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// États globaux
let currentFilter = 'all';
let searchTerm = '';

// Affichage initial
displayTasks();

// Sauvegarde des tâches
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Affichage des tâches + progression
function displayTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <strong>${task.title}</strong> (Priorité : ${task.priority})<br>
            ${task.description}<br>
            Échéance : ${task.dueDate}<br>
            Statut : ${task.completed ? 'Terminé' : 'En cours'}<br>
            <button onclick="toggleTask(${index})">Changer le statut</button>
            <button onclick="deleteTask(${index})">Supprimer</button>
        `;
        taskList.appendChild(li);
    });

    updateProgress();
}

// Mise à jour de la barre de progression
function updateProgress() {
    if (tasks.length === 0) {
        progressBar.value = 0;
        progressText.textContent = '0%';
        return;
    }
    const completedCount = tasks.filter(task => task.completed).length;
    const percent = Math.round((completedCount / tasks.length) * 100);
    progressBar.value = percent;
    progressText.textContent = `${percent}%`;
}

// Ajout de tâche
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newTask = {
        title: form.title.value,
        description: form.description.value,
        dueDate: form['due-date'].value,
        priority: form.priority.value,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks();
    form.reset();
});

// Changement de statut
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

// Suppression de tâche
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// Filtres de statut
document.querySelectorAll('#filters button').forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        displayTasks();
    });
});

// Recherche
searchBar.addEventListener('input', () => {
    searchTerm = searchBar.value.toLowerCase();
    displayTasks();
});
