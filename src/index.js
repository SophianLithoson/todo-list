import {dateToDateString, daysFromNow, formatDisplayedDate} from "./date-fns-wrapper.js";
import "./style.css";

const SOON_IN_DAYS = 3;


class Task {
    constructor(title, notes, dueDate, priority) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.flagged = false;
    }

    getDisplayNode() {
        const _todoNode = Object.assign(document.createElement("div"), {classList: "todo"});
        const _todoCheckbox = Object.assign(document.createElement("input"), {type: "checkbox"});
        const _todoTitle = Object.assign(document.createElement("span"), {classList: "todo-title"});
        const _showMoreButton = Object.assign(document.createElement("button"), {innerHTML: "Show More"});
        const _todoDate = document.createElement("p");
        const _editButton = Object.assign(document.createElement("button"), {classList: "edit-button"});
        const _editButtonIcon = Object.assign(document.createElement("span"), {innerText: "edit", classList: "material-symbols-outlined"});
        const _deleteButton = document.createElement("button");
        const _deleteButtonIcon = Object.assign(document.createElement("span"), {innerText: "delete", classList: "material-symbols-outlined"});

        _todoNode.classList.add(this.priority);
        _todoCheckbox.checked = (this.completed) ? true : false;
        _todoTitle.textContent = this.title;
        _todoDate.textContent = formatDisplayedDate(this.dueDate);
        if (this.isDueSoon()) {
            _todoDate.classList.add("due-soon");
        }       
        
        _todoNode.appendChild(_todoCheckbox);
        _todoNode.appendChild(_todoTitle);
        _todoNode.appendChild(_showMoreButton);
        _todoNode.appendChild(_todoDate);
        _editButton.appendChild(_editButtonIcon);
        _todoNode.appendChild(_editButton);
        _deleteButton.appendChild(_deleteButtonIcon);
        _todoNode.appendChild(_deleteButton);

        return _todoNode;        
    }

    isDueSoon() {
        return daysFromNow(this.dueDate) < SOON_IN_DAYS ? true : false;
    }

    isPastDue() {
        return daysFromNow(this.dueDate) < 0 ? true : false;
    }
}

class Project {
    constructor(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
        this.taskList = [];
    }
    
    addTask(task) {
        this.taskList.push(task);
    }

    deleteTask(task) {
        this.taskList.splice(taskList.indexOf(task), 1);
    }

    getAllTasksNodes() {
        const _taskNodes = [];

        for (let i = 0; this.taskList[i]; i++) {
            _taskNodes.push(this.taskList[i].getDisplayNode()); 
        }

        return _taskNodes;
    }

    getProjectHeaderNodes() {
        const _projectTitle = document.createElement("h2");
        const _projectDescription = document.createElement("p");
        const __projectHeaderSet = [];

        _projectTitle.textContent = this.title;
        _projectDescription.textContent = this.description;
        __projectHeaderSet.push(_projectTitle);
        __projectHeaderSet.push(_projectDescription);

        return __projectHeaderSet;
    }

    getProjectTitleNode() {
        const _projectTitleNode = document.createElement("li");
        _projectTitleNode.textContent = this.title;

        return _projectTitleNode;
    }
}

const todoPage = (() => {
    const addTaskDialog = document.getElementById("add-task-dialog");       // page nodes
    const taskTitle = document.getElementById("task-title");
    const taskNotes = document.getElementById("task-notes");
    const taskDueDate = document.getElementById("task-due-date");
    const taskPriority = document.getElementById("task-priority");
    const projectHeaderNode = document.getElementById("project-header");
    const todoContainerNode = document.getElementById("todo-container");
    const projectContainer = document.getElementById("project-container");
    const buttonAddTask = document.getElementById("add-task-button");
    const taskConfirmBtn = document.getElementById("task-confirm-btn");

    const projectList = [];                                                 // global vars
    let activeProject = 0;
    let taskToEdit = -1;

    const defaultDueDate = new Date(2023, 11, 30);
    const defaultProject = new Project("Default", "This is the default project", defaultDueDate);

    const testTask = new Task("Test Task", "This is a test that my classes are working", defaultDueDate, "medium-priority");
    defaultProject.addTask(testTask);
    const testTaskTwo = new Task("Test Task 2", "Making sure methods all work", defaultDueDate, "high-priority");
    defaultProject.addTask(testTaskTwo);
    projectList.push(defaultProject);

    displayAllProjects(projectList);
    displayProjectTasks(projectList[activeProject]);

    buttonAddTask.addEventListener("click", openTaskDialog);                // click listeners
    taskConfirmBtn.addEventListener("click", createOrEditTask);
    

    function displayProjectTasks(project) {                                 // functions
        const _projectTaskNodes = project.getAllTasksNodes();
        const _projectHeaderSet = project.getProjectHeaderNodes();

        clearNodeChildren(projectHeaderNode);
    
        for (let _i = 0; _projectHeaderSet[_i]; _i++) {
            projectHeaderNode.appendChild(_projectHeaderSet[_i]);
        }

        clearNodeChildren(todoContainerNode);
    
        for (let _j = 0; _projectTaskNodes[_j]; _j++) {
            todoContainerNode.appendChild(_projectTaskNodes[_j]);
        }

        const editButtons = document.getElementsByClassName("edit-button");

        for(let _k = 0; editButtons.item(_k); _k++) {
            editButtons.item(_k).value = _k;
            editButtons.item(_k).addEventListener("click", editTaskDialog);
        }
    }
    
    function displayAllProjects(projectsArray) {    
        for (let _i = 0; projectsArray[_i]; _i++) {
            projectContainer.appendChild(projectsArray[_i].getProjectTitleNode());
        }
    }
    
    function openTaskDialog() {
        taskTitle.value = "";
        taskNotes.value = "";
        taskDueDate.value = dateToDateString(Date.now());
        taskPriority.value = "medium-priority";
        taskToEdit = -1;
        
        addTaskDialog.showModal();
    }

    function editTaskDialog() {
        const t = projectList[activeProject].taskList[this.value];

        taskTitle.value = t.title;
        taskNotes.value = t.notes;
        taskDueDate.value = dateToDateString(t.dueDate);
        taskPriority.value = t.priority;
        taskToEdit = this.value;

        addTaskDialog.showModal();
    }
    
    function createOrEditTask(event) {
        event.preventDefault();

        console.log(taskToEdit);

        if (taskToEdit === -1) {
            const _dueDateAsDate = new Date(`${taskDueDate.value}T00:00`);
            const _newTask = new Task(taskTitle.value, taskNotes.value, _dueDateAsDate, taskPriority.value);
            projectList[activeProject].addTask(_newTask);
        }
        else {
            projectList[activeProject].taskList[taskToEdit].title = taskTitle.value;
            projectList[activeProject].taskList[taskToEdit].notes = taskNotes.value;
            projectList[activeProject].taskList[taskToEdit].dueDate = new Date(`${taskDueDate.value}T00:00`);
            projectList[activeProject].taskList[taskToEdit].priority = taskPriority.value;
        }
        
        
        displayProjectTasks(projectList[activeProject]);
        addTaskDialog.close();
    }

    function clearNodeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
})();