console.log("testing it's working");

import {daysFromNow, formatDate} from "./date-fns-wrapper.js";
import "./style.css";

const SOON_IN_DAYS = 3;


class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
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
        const _editButton = document.createElement("button");
        const _editButtonIcon = Object.assign(document.createElement("span"), {innerText: "edit", classList: "material-symbols-outlined"});
        const _deleteButton = document.createElement("button");
        const _deleteButtonIcon = Object.assign(document.createElement("span"), {innerText: "delete", classList: "material-symbols-outlined"});

        if (this.completed) {
            _todoCheckbox.checked = true;
        }
        _todoTitle.textContent = this.description;
        _todoDate.textContent = formatDate(this.dueDate);        
        
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
        const _projectHeaderSet = [];

        _projectTitle.textContent = this.title;
        _projectDescription.textContent = this.description;
        _projectHeaderSet.push(_projectTitle);
        _projectHeaderSet.push(_projectDescription);

        return _projectHeaderSet;
    }

    getProjectTitleNode() {
        const _projectTitleNode = document.createElement("li");
        _projectTitleNode.textContent = this.title;

        return _projectTitleNode;
    }
}

function displayProjectTasks(project) {
    const projectHeaderNode = document.getElementById("project-header");
    const todoContainerNode = document.getElementById("todo-container");
    const projectTaskNodes = project.getAllTasksNodes();
    const projectHeaderSet = project.getProjectHeaderNodes();

    for (let _i = 0; projectHeaderSet[_i]; _i++) {
        projectHeaderNode.appendChild(projectHeaderSet[_i]);
    }

    for (let _j = 0; projectTaskNodes[_j]; _j++) {
        todoContainerNode.appendChild(projectTaskNodes[_j]);
    }
}

function displayAllProjects(projectsArray) {
    const projectContainer = document.getElementById("project-container");

    for (let _i = 0; projectsArray[_i]; _i++) {
        projectContainer.appendChild(projectsArray[_i].getProjectTitleNode());
    }
}

const todoPage = (() => {
    const defaultDueDate = new Date(2023, 11, 30);
    const defaultProject = new Project("Default", "This is the default project", defaultDueDate);
    const projectList = [];

    const testTask = new Task("Test Task", "This is a test that my classes are working", defaultDueDate, 2);
    defaultProject.addTask(testTask);
    const testTaskTwo = new Task("Test Task 2", "Making sure methods all work", defaultDueDate, 3);
    defaultProject.addTask(testTaskTwo);
    projectList.push(defaultProject);

    displayAllProjects(projectList);
    displayProjectTasks(projectList[0]);
})();