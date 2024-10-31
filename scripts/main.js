// Récupère nos éléments HTML et on les stocke
let form = document.getElementById("form");
let title = form.querySelector("#title");
let description = form.querySelector("#description");

// Tableau qui stockera nos tâches
let taskList = [];

// Charger les tâches depuis localStorage lors du chargement de la page
window.onload = function () {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        taskList = JSON.parse(savedTasks);
        taskList.forEach(task => addTask(task));
    }
};

// Depuis la variable form, je lui affecte un évènement de type submit (soumission de formulaire)
form.addEventListener("submit", function (event) {
    // Bloquer le rechargement de la page
    event.preventDefault();

    // Déclaration de notre objet
    let newTask = {
        title: title.value,
        description: description.value
    };

    // Vérifier si les champs sont vides
    if (newTask.title === "" || newTask.description === "") {
        alert("Champ vide");
        return;
    }

    // Ajouter la tâche dans le tableau taskList
    taskList.push(newTask);

    // Sauvegarder dans localStorage
    saveTasksToLocalStorage();

    // Ajouter la tâche dans la liste UL (affichage des tâches)
    addTask(newTask);

    // Réinitialiser les champs du formulaire après ajout
    title.value = "";
    description.value = "";
});

function addTask(taskToAdd) {
    // Importer notre <ul> via son id "list"
    let list = document.getElementById('list');

    // Créer une nouvelle balise <li>
    let li = document.createElement("li");

    // Ajouter le titre et la description dans la balise <li>
    li.textContent = taskToAdd.title + " : " + taskToAdd.description;

    // Créer le bouton Modifier
    let editButton = document.createElement("button");
    editButton.textContent = 'Modifier';
    editButton.addEventListener("click", function () {
        editTask(taskToAdd, li);
    });

    // Créer le bouton Supprimer
    let deleteButton = document.createElement("button");
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener("click", function () {
        deleteTask(taskToAdd, li);
    });

    // Ajouter les boutons à la balise <li>
    li.append(editButton);
    li.append(deleteButton);

    // Ajouter l'élément <li> à la liste <ul> avec une animation
    li.style.opacity = "0";
    list.append(li);
    setTimeout(() => {
        li.style.opacity = "1";
    }, 100); // Ajoute une légère animation pour l'apparition
}

function deleteTask(taskToDelete, taskElement) {
    // Supprimer l'élément li de la liste ul avec une animation
    taskElement.style.opacity = "0";
    setTimeout(() => {
        taskElement.remove();
    }, 300); // Retirer après animation

    // Supprimer la tâche du tableau
    taskList = taskList.filter(task => task !== taskToDelete);

    // Sauvegarder dans localStorage après suppression
    saveTasksToLocalStorage();
}

function editTask(taskToEdit, taskElement) {
    // Remplir les champs input avec les valeurs actuelles de la tâche à modifier
    title.value = taskToEdit.title;
    description.value = taskToEdit.description;

    // Changer le bouton "Ajouter" en bouton "Enregistrer" lors de la modification
    let saveButton = document.createElement("button");
    saveButton.textContent = "Enregistrer";

    // Remplacer le bouton "Ajouter" par "Enregistrer"
    let addButton = form.querySelector("button");
    form.replaceChild(saveButton, addButton);

    // Ajouter un événement au bouton "Enregistrer"
    saveButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Mettre à jour les valeurs de la tâche
        taskToEdit.title = title.value;
        taskToEdit.description = description.value;

        // Mettre à jour l'affichage de la tâche dans l'élément li sans en créer un nouveau
        taskElement.textContent = taskToEdit.title + " : " + taskToEdit.description;

        // Réajouter les boutons Modifier et Supprimer après mise à jour
        taskElement.appendChild(editButton);
        taskElement.appendChild(deleteButton);

        // Sauvegarder dans localStorage après modification
        saveTasksToLocalStorage();

        // Réinitialiser le formulaire et remplacer le bouton "Enregistrer" par le bouton "Ajouter"
        form.replaceChild(addButton, saveButton);
        title.value = "";
        description.value = "";
    });

    // Création des boutons Modifier et Supprimer qui doivent être réutilisés après modification
    let editButton = document.createElement("button");
    editButton.textContent = 'Modifier';
    editButton.addEventListener("click", function () {
        editTask(taskToEdit, taskElement);
    });

    let deleteButton = document.createElement("button");
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener("click", function () {
        deleteTask(taskToEdit, taskElement);
    });
}

// Sauvegarder la liste des tâches dans localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}
