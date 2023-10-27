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
        const todoNode = Object.assign(document.createElement("div"), {classList: "todo"});
        const todoCheckbox = Object.assign(document.createElement("input"), {type: "checkbox"});
        const todoTitle = Object.assign(document.createElement("span"), {classList: "todo-title"});
        const showMoreButton = Object.assign(document.createElement("button"), {innerHTML: "Show More"});
        const todoDate = document.createElement("p");
        const editButton = document.createElement("p");
        const deleteButton = document.createElement("p");

        if (this.completed) {
            todoCheckbox.checked = true;
        }
        todoTitle.textContent = this.description;
        todoDate.textContent = formatDate(this.dueDate);
        editButton.textContent = "E";
        deleteButton.textContent = "D";

        todoNode.appendChild(todoCheckbox);
        todoNode.appendChild(todoTitle);
        todoNode.appendChild(showMoreButton);
        todoNode.appendChild(todoDate);
        todoNode.appendChild(editButton);
        todoNode.appendChild(deleteButton);

        return todoNode;        
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
        for (let i = 0; this.taskList[i]; i++) {
            this.taskList[i].getDisplayNode();
        }
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
    todoContainerNode.appendChild(testTask.getDisplayNode());
    todoContainerNode.appendChild(testTaskTwo.getDisplayNode());
})();