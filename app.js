const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#tasks');
const taskList = document.querySelector('.task-collection');
const filter = document.querySelector('#filter');
const clearBtn = document.querySelector('#clear-btn');
const completedTaskList = document.querySelector('.completed');
const clearCompletedBtn = document.querySelector('#clear-completed');

loadEventListeners();

//Event Listeners
function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', displayTaskInUI)
    document.addEventListener('DOMContentLoaded', displayCompletedTask);
    taskForm.addEventListener('submit', addTasks);
    clearBtn.addEventListener('click', clearTask);
    filter.addEventListener('input', filterTasks);
    taskList.addEventListener('click', function(e) {
        removeTask(e);
        cancelCompletedTask(e);
        disableTextBoxInLS(e);
    });
    //taskList.addEventListener('click', cancelCompletedTask);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

//show task in the UI
function displayTaskInUI(task) {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task) {
        let li = document.createElement('li');
        li.className = 'collection-items';
        li.appendChild(document.createTextNode(task));
        const completeBtn = document.createElement('button');
        completeBtn.className = 'remove';
        completeBtn.appendChild(document.createTextNode('Remove'));
        li.appendChild(completeBtn);
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('title', 'Completed');
        checkbox.className = 'checkTasks';
        li.appendChild(checkbox);
        taskList.appendChild(li);
    })
}

//Display completed task saved in LS
function displayCompletedTask(task) {
    let completedTasks;
    if(localStorage.getItem('completed') === null) {
        completedTasks = [];
    } else {
        completedTasks = JSON.parse(localStorage.getItem('completed'));
    }
    completedTasks.forEach(function(finished) {
        const li = document.createElement('li');
        li.className = 'completed-list';
        li.appendChild(document.createTextNode(finished));
        const tickContainer = document.createElement('span');
        tickContainer.className = 'tick-container';
        const tick = document.createElement('a');
        tick.className = 'tick';
        tick.innerHTML = '&#x2713;';
        tickContainer.appendChild(tick);
        li.appendChild(tickContainer);
        completedTaskList.appendChild(li);
    })
}

//This populate the UI with the list of tasks
function addTasks(e) {
    if(taskInput.value === '') {
       showAlert('Please fill in a task', 'error')
    } else {
        const li = document.createElement('li');
        li.className = 'collection-items';
        li.appendChild(document.createTextNode(taskInput.value));
        const completeBtn = document.createElement('button');
        completeBtn.className = 'remove';
        completeBtn.appendChild(document.createTextNode('Remove'));
        li.appendChild(completeBtn);
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('title', 'Completed');
        checkbox.className = 'checkTasks';
        li.appendChild(checkbox);
        taskList.appendChild(li);
        //Task added alert
        showAlert('Task Added Successfully', 'success');
        //Save to local storage
        saveTaskToLocalStorage(taskInput.value);
    }
    taskInput.value = '';
    e.preventDefault();
}

//save task to Local storage
function saveTaskToLocalStorage(task) {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//This is for the button that clears all the tasks in the UI
function clearTask() {
    while(taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);

        //clear task from LS
        clearTaskFromLocalStorage();
    }
}

//clear task from LS
function clearTaskFromLocalStorage() {
    localStorage.removeItem('tasks');
}

//This filters the tasks
function filterTasks(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.collection-items').forEach(function(task) {
        const inputText = task.firstChild.textContent;

        if(inputText.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    })
}
//This removes the tasks from the UI
function removeTask(e) {
    if(e.target.classList.contains('remove')) {
        if(confirm('Are you sure?')) {
            e.target.parentElement.remove();
            //remove from local storage
            removeTaskFromLocalStorage(e.target.parentElement.firstChild);
        }
    }
}

//remove task from LS
function removeTaskFromLocalStorage(item) {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task, index) {
        if(item.textContent === task) {
            tasks.splice(index, 1);
        }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Displays alert for Added task and empty input field

function showAlert(message, className) {
    let container = document.querySelector('.container');
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', className);
    alertDiv.appendChild(document.createTextNode(message));
    container.insertBefore(alertDiv, taskForm);

    setTimeout(() => alertDiv.remove(), 2000);
}

//This cancels the tasks whenever the checkbox is checked
function cancelCompletedTask(e) {
    const task = e.target.parentElement;
    if(e.target.checked) {
        if(confirm('Have you completed this task?')) {
            e.target.disabled = true;
            task.style.textDecoration = 'line-through';
            task.style.color = 'red';
            appendCompletedTask(task.firstChild.textContent);
            saveCompletedTasksToLS(task.firstChild.textContent);
            disableTextBoxInLS(e.target.disabled);
        } else {
            e.target.checked = false;
            task.style.textDecoration = 'none';
            task.style.color = '#000';
        } 
    }
}

//Displays the list of completed Tasks
function appendCompletedTask(tasks) {
    const li = document.createElement('li');
    li.className = 'completed-list';
    li.appendChild(document.createTextNode(tasks));
    const tickContainer = document.createElement('span');
    tickContainer.className = 'tick-container';
    const tick = document.createElement('a');
    tick.className = 'tick';
    tick.innerHTML = '&#x2713;';
    tickContainer.appendChild(tick);
    li.appendChild(tickContainer);
    completedTaskList.appendChild(li);
    // console.log(li.firstChild.textContent);
}

//Saves the lists of completed Tasks to the LS
function saveCompletedTasksToLS(task) {
    let completedTasks;
    if(localStorage.getItem('completed') === null) {
        completedTasks = [];
    } else {
        completedTasks = JSON.parse(localStorage.getItem('completed'));
    }
    completedTasks.push(task);
    localStorage.setItem('completed', JSON.stringify(completedTasks));
}

//This is for the Clear completed Tasks button 
function clearCompletedTasks() {
    while(completedTaskList.firstChild) {
        completedTaskList.removeChild(completedTaskList.firstChild);
    }
    //Task for the day has been completed. Therefore, there is the need to clear the task from the local storage to prevent it from mixing up with a new day completed tasks.
    localStorage.removeItem('completed');
}

//This is to enable me persist the disabled checkbox whenever the page is reloaded.
function disableTextBoxInLS(e) {
    let checkboxValues;
    if(localStorage.getItem('checkedTasks') === null) {
        checkboxValues = [];
    } else {
        checkboxValues = JSON.parse(localStorage.getItem('checkTasks'));
    }
    if(e.checked) {
        localStorage.setItem('checkedTasks', JSON.stringify(e));
    }
}