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
        const _editButton = document.createElement("p");
        const _deleteButton = document.createElement("p");

        if (this.completed) {
            _todoCheckbox.checked = true;
        }
        _todoTitle.textContent = this.description;
        _todoDate.textContent = formatDate(this.dueDate);
        _editButton.textContent = "E";
        _deleteButton.textContent = "D";

        _todoNode.appendChild(_todoCheckbox);
        _todoNode.appendChild(_todoTitle);
        _todoNode.appendChild(_showMoreButton);
        _todoNode.appendChild(_todoDate);
        _todoNode.appendChild(_editButton);
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
}

const todoPage = (() => {
    const defaultDueDate = new Date("2023-12-30");
    const defaultProject = new Project("Default", "This is the default project", defaultDueDate);

    const testTask = new Task("Test Task", "This is a test that my classes are working", defaultDueDate, 2);
    defaultProject.addTask(testTask);
    const testTaskTwo = new Task("Test Task 2", "Making sure methods all work", defaultDueDate, 3);
    defaultProject.addTask(testTaskTwo);

    const todoContainerNode = document.getElementById("todo-container");
    const projectTaskNodes = defaultProject.getAllTasksNodes();
    
    for (let i = 0; projectTaskNodes[i]; i++) {
        todoContainerNode.appendChild(projectTaskNodes[i]);
    }
})();