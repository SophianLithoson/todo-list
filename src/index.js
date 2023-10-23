console.log("testing it's working");

import {daysFromNow} from "./date-fns-wrapper.js";

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
        console.log(this);
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

// const todoPage = (() => {
    const defaultDueDate = new Date("2023-12-30");
    const defaultProject = new Project("Default", "This is the default project", defaultDueDate);

    const testTask = new Task("Test Task", "This is a test that my classes are working", defaultDueDate, 2);
    defaultProject.addTask(testTask);
    defaultProject.getAllTasksNodes();

    const testTaskTwo = new Task("Test Task 2", "Making sure methods all work", defaultDueDate, 3);
    defaultProject.addTask(testTaskTwo);
    defaultProject.getAllTasksNodes();
// })();

