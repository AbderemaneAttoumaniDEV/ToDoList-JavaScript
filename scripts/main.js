// Récupère nos éléments HTML
let form = document.getElementById("form");
let title = form.querySelector("#title");
let description = form.querySelector("#description");
let categorySelect = form.querySelector("#category");
let taskCount = document.getElementById("task-count");
let themeToggle = document.getElementById("theme-toggle");
let searchInput = document.getElementById("search");

let taskList = [];

// Charger les tâches depuis localStorage
window.onload = function () {
    // Charger le mode depuis localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        applyTheme(storedTheme); // Applique le thème stocké
    } else {
        // Si aucun thème n'est stocké, on définit le mode clair par défaut
        applyTheme('light');
    }

    // Charger les tâches depuis localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        taskList = JSON.parse(savedTasks);
        taskList.forEach(task => addTask(task));
        updateTaskCount();
    }
    // Appliquer les styles des champs de texte et des éléments de la liste en fonction du thème actuel
    updateFormFieldsTheme();
    updateTaskListTheme();
};

// Soumission du formulaire pour ajouter une tâche
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let newTask = {
        title: title.value,
        description: description.value,
        category: categorySelect.value,
        completed: false
    };

    if (newTask.title === "" || newTask.description === "") {
        alert("Champ vide");
        return;
    }

    taskList.push(newTask);
    saveTasksToLocalStorage();
    addTask(newTask);

    title.value = "";
    description.value = "";
    updateTaskCount();
});

// Ajouter une tâche dans l'interface
function addTask(taskToAdd) {
    let list = document.getElementById('list');
    let li = document.createElement("li");

    // Appliquer les bonnes classes en fonction du mode (clair ou sombre)
    if (document.body.classList.contains("bg-gray-900")) {
        li.className = "flex justify-between items-center bg-gray-700 text-white rounded-md shadow p-4 hover:bg-gray-800 transition";
    } else {
        li.className = "flex justify-between items-center bg-gray-100 text-gray-900 rounded-md shadow p-4 hover:bg-gray-200 transition";
    }

    let taskContent = document.createElement("div");
    taskContent.textContent = `(${taskToAdd.category}) ${taskToAdd.title} : ${taskToAdd.description}`;
    taskContent.className = `text-gray-400 font-medium ${taskToAdd.completed ? 'line-through' : ''}`;

    // Affichage de la date de création
    let taskDate = document.createElement("span");
    taskDate.className = "text-xs text-gray-500";
    taskDate.textContent = `Créé le : ${new Date(taskToAdd.createdAt).toLocaleString()}`;

    // Ajouter un conteneur pour la date
    let taskHeader = document.createElement("div");
    taskHeader.className = "flex justify-between items-center";
    taskHeader.append(taskContent, taskDate);

    let editButton = document.createElement("button");
    editButton.textContent = 'Modifier';
    editButton.className = "text-sm bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = 'Supprimer';
    deleteButton.className = "text-sm bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition";

    let completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = taskToAdd.completed;
    completeCheckbox.className = "mr-2";
    completeCheckbox.addEventListener("change", function () {
        taskToAdd.completed = completeCheckbox.checked;
        taskContent.classList.toggle('line-through', taskToAdd.completed);
        saveTasksToLocalStorage();
        updateTaskCount();
    });

    editButton.addEventListener("click", function () {
        editTask(taskToAdd, li);
    });
    deleteButton.addEventListener("click", function () {
        deleteTask(taskToAdd, li);
    });

    let buttonGroup = document.createElement("div");
    buttonGroup.className = "flex space-x-2";
    buttonGroup.append(editButton, deleteButton);

    li.append(completeCheckbox, taskContent, buttonGroup);
    list.appendChild(li);
    updateTaskCount();
}

// Supprimer une tâche
function deleteTask(taskToDelete, taskElement) {
    taskElement.style.opacity = "0";
    setTimeout(() => {
        taskElement.remove();
        taskList = taskList.filter(task => task !== taskToDelete);
        saveTasksToLocalStorage();
        updateTaskCount();
    }, 300);
}

// Modifier une tâche
function editTask(taskToEdit, taskElement) {
    // Enregistrer les valeurs d'origine pour pouvoir les restaurer si nécessaire
    const originalTitle = taskToEdit.title;
    const originalDescription = taskToEdit.description;
    const originalCategory = taskToEdit.category;
    title.value = taskToEdit.title;
    description.value = taskToEdit.description;
    categorySelect.value = taskToEdit.category;

    let saveButton = document.createElement("button");
    saveButton.textContent = "Enregistrer";
    saveButton.className = "w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-all duration-300";

    let addButton = form.querySelector("button");
    form.replaceChild(saveButton, addButton);

    saveButton.addEventListener("click", function (event) {
        event.preventDefault();
        taskToEdit.title = title.value;
        taskToEdit.description = description.value;
        taskToEdit.category = categorySelect.value;

        taskElement.querySelector("div").textContent = `(${taskToEdit.category}) ${taskToEdit.title} : ${taskToEdit.description}`;

        saveTasksToLocalStorage();
        form.replaceChild(addButton, saveButton);
        title.value = "";
        description.value = "";
        updateTaskCount();
    });
}

// Sauvegarder les tâches dans localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Mettre à jour le compteur de tâches
function updateTaskCount() {
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(task => task.completed).length;
    taskCount.textContent = `Tâches totales : ${totalTasks} | Complétées : ${completedTasks}`;
}

// Recherche dynamique des tâches
searchInput.addEventListener("input", function () {
    const searchQuery = searchInput.value.toLowerCase();
    let filteredTasks = taskList.filter(task => 
        task.title.toLowerCase().includes(searchQuery) || 
        task.description.toLowerCase().includes(searchQuery)
    );
    updateTaskList(filteredTasks);
});

// Mettre à jour la liste affichée
function updateTaskList(filteredTasks) {
    let list = document.getElementById('list');
    list.innerHTML = "";
    filteredTasks.forEach(task => addTask(task));
}

// Basculement du mode clair/sombre
themeToggle.addEventListener("click", function () {
    const currentTheme = document.body.classList.contains("bg-gray-900") ? "dark" : "light";
    // Applique l'autre thème
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);
    // Appliquer les styles des champs de texte et des éléments de la liste en fonction du nouveau mode
    updateFormFieldsTheme();
    updateTaskListTheme();

    // Sauvegarder le thème dans localStorage pour qu'il persiste après un rechargement
    localStorage.setItem('theme', newTheme);
});

// Mettre à jour les champs de texte (Titre, Description, Catégorie, Rechercher)
function updateFormFieldsTheme() {
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let searchInput = document.getElementById("search");
    let categorySelect = document.getElementById("category");

    if (document.body.classList.contains("bg-gray-900")) {
        // Mode sombre : texte clair sur fond sombre
        title.classList.add("bg-gray-700", "text-white", "border-gray-600");
        description.classList.add("bg-gray-700", "text-white", "border-gray-600");
        searchInput.classList.add("bg-gray-700", "text-white", "border-gray-600");
        categorySelect.classList.add("bg-gray-700", "text-white", "border-gray-600");

        title.classList.remove("bg-white", "text-gray-900", "border-gray-300");
        description.classList.remove("bg-white", "text-gray-900", "border-gray-300");
        searchInput.classList.remove("bg-white", "text-gray-900", "border-gray-300");
        categorySelect.classList.remove("bg-white", "text-gray-900", "border-gray-300");
    } else {
        // Mode clair : texte sombre sur fond clair
        title.classList.add("bg-white", "text-gray-900", "border-gray-300");
        description.classList.add("bg-white", "text-gray-900", "border-gray-300");
        searchInput.classList.add("bg-white", "text-gray-900", "border-gray-300");
        categorySelect.classList.add("bg-white", "text-gray-900", "border-gray-300");

        title.classList.remove("bg-gray-700", "text-white", "border-gray-600");
        description.classList.remove("bg-gray-700", "text-white", "border-gray-600");
        searchInput.classList.remove("bg-gray-700", "text-white", "border-gray-600");
        categorySelect.classList.remove("bg-gray-700", "text-white", "border-gray-600");
    }
}

// Mettre à jour le thème des éléments de la liste (en mode sombre ou clair)
function updateTaskListTheme() {
    let listItems = document.querySelectorAll("#list li");

    listItems.forEach(item => {
        if (document.body.classList.contains("bg-gray-900")) {
            item.classList.add("bg-gray-700", "text-white", "border-gray-600");
            item.classList.remove("bg-gray-100", "text-gray-900", "border-gray-300");
        } else {
            item.classList.add("bg-gray-100", "text-gray-900", "border-gray-300");
            item.classList.remove("bg-gray-700", "text-white", "border-gray-600");
        }
    });
}
// Fonction qui applique les bonnes classes en fonction du thème
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add("bg-gray-900", "text-white");
        document.body.classList.remove("bg-gray-100", "text-gray-900");
        themeToggle.textContent = "Mode Clair"; // Mise à jour du texte du bouton
    } else {
        document.body.classList.add("bg-gray-100", "text-gray-900");
        document.body.classList.remove("bg-gray-900", "text-white");
        themeToggle.textContent = "Mode Sombre"; // Mise à jour du texte du bouton
    }
}


form.addEventListener("submit", function (event) {
    event.preventDefault();

    let newTask = {
        title: title.value,
        description: description.value,
        category: categorySelect.value,
        completed: false,
        createdAt: new Date().toISOString()  // Ajouter la date de création
    };

    if (newTask.title === "" || newTask.description === "") {
        return;
    }

    taskList.push(newTask);
    saveTasksToLocalStorage();
    addTask(newTask);

    title.value = "";
    description.value = "";
    updateTaskCount();
});


// Récupérer le bouton de filtrage et les options de tri
let sortButton = document.getElementById("sort-button");
let sortOptions = document.getElementById("sort-options");

// Ajouter un événement pour afficher/masquer les options de tri
sortButton.addEventListener("click", function () {
    sortOptions.classList.toggle("hidden"); // Afficher ou cacher les options de tri
});

// Récupérer l'élément des options de tri
sortOptions.addEventListener("change", function () {
    let selectedOption = sortOptions.value; // Récupérer la valeur sélectionnée
    sortTasks(selectedOption); // Appliquer le tri en fonction de la sélection
});

function sortTasks(criteria) {
    let sortedTasks;

    switch (criteria) {
        case "title-asc":
            sortedTasks = [...taskList].sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "title-desc":
            sortedTasks = [...taskList].sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "category":
            sortedTasks = [...taskList].sort((a, b) => a.category.localeCompare(b.category));
            break;
        case "completed":
            sortedTasks = [...taskList].sort((a, b) => a.completed - b.completed);
            break;
        case "date-asc":
            sortedTasks = [...taskList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case "date-desc":
            sortedTasks = [...taskList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            sortedTasks = taskList;
    }

    updateTaskList(sortedTasks);
}
