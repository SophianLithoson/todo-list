import {dateToDateString, daysFromNow, formatDisplayedDate} from "./date-fns-wrapper.js";
import "./style.css";

const SOON_IN_DAYS = 3;


class Task {
    constructor(title, dueDate, priority) {
        this.title = title;
        this.notes = "";
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.showMore = false;
    }

    getDisplayNodes() {
        const _todoNodeWrapper = Object.assign(document.createElement("div"), {classList: "todo"});
        const _todoNode = Object.assign(document.createElement("div"), {classList: "todo-div"});
        const _todoCheckbox = Object.assign(document.createElement("input"), {type: "checkbox", classList: "todo-checkbox"});
        const _todoTitle = Object.assign(document.createElement("span"), {classList: "todo-title"});
        const _showMoreButton = Object.assign(document.createElement("button"), {classList: "show-more-button"});
        const _todoDate = document.createElement("p");
        const _editButton = Object.assign(document.createElement("button"), {classList: "edit-task-button"});
        const _editButtonIcon = Object.assign(document.createElement("span"), {innerText: "edit", classList: "material-symbols-outlined"});
        const _deleteButton = Object.assign(document.createElement("button"), {classList: "delete-button"});
        const _deleteButtonIcon = Object.assign(document.createElement("span"), {innerText: "delete", classList: "material-symbols-outlined"});

        _todoNodeWrapper.classList.add(this.priority);
        _todoCheckbox.checked = (this.completed) ? true : false;
        _todoTitle.textContent = this.title;
        _showMoreButton.textContent = (this.showMore) ? "Save & Close" : "Show Notes";
        _todoDate.textContent = formatDisplayedDate(this.dueDate);
        if (this.isPastDue()) {
            _todoDate.classList.add("past-due");
        }
        else if (this.isDueSoon()) {
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
        _todoNodeWrapper.appendChild(_todoNode);

        if (!this.showMore) {                                   
            return _todoNodeWrapper;
        }

        const _detailsNode = Object.assign(document.createElement("div"), {classList: "todo-div", style: "margin-top: 1rem;"});
        const _notesNode = Object.assign(document.createElement("textarea"), {rows: "6", cols: "50"});
        _notesNode.value = this.notes;
        _detailsNode.appendChild(_notesNode);
        _todoNodeWrapper.appendChild(_detailsNode);

        return _todoNodeWrapper;
    }

    isDueSoon() {
        return daysFromNow(this.dueDate) < SOON_IN_DAYS ? true : false;
    }

    isPastDue() {
        return daysFromNow(this.dueDate) < 0 ? true : false;
    }

    toggleComplete() {
        this.completed = (this.completed) ? false : true;
    }
}

class Project {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.taskList = [];
    }
    
    addTask(task) {
        this.taskList.push(task);
    }

    deleteTask(taskIndex) {
        this.taskList.splice(taskIndex, 1);
    }

    getAllTasksNodes() {
        const _taskNodes = [];

        for (let i = 0; this.taskList[i]; i++) {
            const _displayNode = this.taskList[i].getDisplayNodes();
            _displayNode.id = "todo-" + i;
            _taskNodes.push(_displayNode); 
        }

        return _taskNodes;
    }

    getProjectHeaderNodes() {
        const _projectTitleContainer = Object.assign(document.createElement("div"), {classList: "project-title-container"});
        const _projectTitle = document.createElement("h2");
        const _projectEditBtn = Object.assign(document.createElement("button"), {id: "edit-project-button"});
        const _projectEditBtnIcon = Object.assign(document.createElement("span"), {innerText: "edit", classList: "material-symbols-outlined"});
        const _projectDescription = document.createElement("p");
        const _projectHeaderSet = [];

        _projectTitle.textContent = this.title;
        _projectDescription.textContent = this.description;

        _projectTitleContainer.appendChild(_projectTitle);
        _projectEditBtn.appendChild(_projectEditBtnIcon);
        _projectTitleContainer.appendChild(_projectEditBtn);
        _projectHeaderSet.push(_projectTitleContainer);
        _projectHeaderSet.push(_projectDescription);

        return _projectHeaderSet;
    }

    getProjectTitleNode() {
        const _projectTitleNode = document.createElement("li");
        const _projectTitle = Object.assign(document.createElement("span"), {classList: "project-title-span"});
        const _projectDelBtn = Object.assign(document.createElement("button"), {classList: "delete-project-button", innerText: "✕", ariaLabel: "delete"});

        _projectTitle.textContent = this.title;
        _projectTitleNode.appendChild(_projectTitle);
        _projectTitleNode.appendChild(_projectDelBtn);

        return _projectTitleNode;
    }
}

const todoPage = (() => {
    const addTaskDialog = document.getElementById("add-task-dialog");       // page nodes
    const taskTitle = document.getElementById("task-title");
    const taskDueDate = document.getElementById("task-due-date");
    const taskPriority = document.getElementById("task-priority");
    const projectHeaderNode = document.getElementById("project-header");
    const todoContainerNode = document.getElementById("todo-container");
    const projectContainer = document.getElementById("project-container");
    const buttonAddTask = document.getElementById("add-task-button");
    const taskConfirmBtn = document.getElementById("task-confirm-btn");
    const buttonAddProject = document.getElementById("add-project-button");
    const addProjectDialog = document.getElementById("add-project-dialog");
    const projectTitle = document.getElementById("project-title");
    const projectDescription = document.getElementById("project-description");
    const projectConfirmBtn = document.getElementById("project-confirm-btn");

    const projectList = [];                                                 // global vars
    let activeProject = 0;
    let taskToEdit = -1;
    let projectToEdit = -1;

    const defaultDueDate = new Date(2023, 11, 30);
    const defaultProject = new Project("Default", "This is the default project");

    const testTask = new Task("Test Task", defaultDueDate, "medium-priority");
    defaultProject.addTask(testTask);
    const testTaskTwo = new Task("Test Task 2", defaultDueDate, "high-priority");
    defaultProject.addTask(testTaskTwo);
    projectList.push(defaultProject);

    refreshScreen();    

    function displayProjectTasks(project) {                                 // functions
        clearNodeChildren(projectHeaderNode);
        clearNodeChildren(todoContainerNode);
        
        if (project === undefined) {
            buttonAddTask.style.display = "none";
            return;
        }
        
        const _projectTaskNodes = project.getAllTasksNodes();
        const _projectHeaderSet = project.getProjectHeaderNodes();
    
        for (let _i = 0; _projectHeaderSet[_i]; _i++) {
            projectHeaderNode.appendChild(_projectHeaderSet[_i]);
        }
    
        for (let _j = 0; _projectTaskNodes[_j]; _j++) {
            todoContainerNode.appendChild(_projectTaskNodes[_j]);
        }
        
        buttonAddTask.style.display = "flex";
    }

    function setAllClickListeners() {
        const editProjectButton = document.querySelector("#edit-project-button");
        editProjectButton.addEventListener("click", editProjectDialog);
        buttonAddTask.addEventListener("click", openTaskDialog);                
        taskConfirmBtn.addEventListener("click", createOrEditTask);
        buttonAddProject.addEventListener("click", openProjectDialog);
        projectConfirmBtn.addEventListener("click", createOrEditProject);

        const editTaskButtons = document.getElementsByClassName("edit-task-button");

        for (let _k = 0; editTaskButtons.item(_k); _k++) {
            editTaskButtons.item(_k).value = _k;
            editTaskButtons.item(_k).addEventListener("click", editTaskDialog);
        }

        const deleteButtons = document.getElementsByClassName("delete-button");

        for (let _m = 0; deleteButtons.item(_m); _m++) {
            deleteButtons.item(_m).value = _m;
            deleteButtons.item(_m).addEventListener("click", removeTask);
        }

        const showMoreButtons = document.getElementsByClassName("show-more-button");

        for (let _n = 0; showMoreButtons.item(_n); _n++) {
            showMoreButtons.item(_n).value = _n;
            showMoreButtons.item(_n).addEventListener("click", toggleShowMore);
        }

        const taskCheckboxes = document.getElementsByClassName("todo-checkbox");

        for (let _p = 0; taskCheckboxes.item(_p); _p++) {
            taskCheckboxes.item(_p).value = _p;
            taskCheckboxes.item(_p).addEventListener("click", toggleTaskComplete);
        }

        const projectListSpans = document.getElementsByClassName("project-title-span");

        for (let _r = 0; projectListSpans.item(_r); _r++) {
            projectListSpans.item(_r).value = _r;
            projectListSpans.item(_r).addEventListener("click", makeProjectActive);
        }

        const projectDeleteIcons = document.getElementsByClassName("delete-project-button");

        for (let _q = 0; projectDeleteIcons.item(_q); _q++) {
            projectDeleteIcons.item(_q).value = _q;
            projectDeleteIcons.item(_q).addEventListener("click", removeProject);
        }
    }
    
    function displayAllProjects(projectsArray) {
        clearNodeChildren(projectContainer);
        
        for (let _i = 0; projectsArray[_i]; _i++) {
            const _projectToAdd = projectsArray[_i].getProjectTitleNode();

            if (activeProject === _i) {
                _projectToAdd.classList.add("selected"); 
            }
            projectContainer.appendChild(_projectToAdd);
        }
    }

    function openProjectDialog() {
        projectTitle.value = "";
        projectDescription.value = "";
        projectToEdit = -1;

        addProjectDialog.showModal();
    }

    function editProjectDialog() {
        const p = projectList[activeProject];

        projectTitle.value = p.title;
        projectDescription.value = p.description
        projectToEdit = activeProject;

        addProjectDialog.showModal();
    }

    function removeProject() {
        projectList.splice(this.value, 1);

        if (projectList[this.value]) {
            activeProject = this.value;
        }
        else if (projectList[this.value - 1]) {
            activeProject = this.value - 1;
        }
        else {
            activeProject = -1;
        }

        refreshScreen();
    }
    
    function createOrEditProject(event) {
        event.preventDefault();

        if (projectToEdit === -1) {
            const _newProject = new Project(projectTitle.value, projectDescription.value);
            projectList.push(_newProject);
            activeProject = projectList.length - 1;
        }
        else {
            projectList[projectToEdit].title = projectTitle.value;
            projectList[projectToEdit].description = projectDescription.value;
        }

        addProjectDialog.close();
        refreshScreen();
    }

    function openTaskDialog() {
        taskTitle.value = "";
        taskDueDate.value = dateToDateString(Date.now());
        taskPriority.value = "medium-priority";
        taskToEdit = -1;
        
        addTaskDialog.showModal();
    }

    function editTaskDialog() {
        const t = projectList[activeProject].taskList[this.value];

        taskTitle.value = t.title;
        taskDueDate.value = dateToDateString(t.dueDate);
        taskPriority.value = t.priority;
        taskToEdit = this.value;

        addTaskDialog.showModal();
    }

    function removeTask() {
        projectList[activeProject].deleteTask(this.value);
        refreshScreen();
    }
    
    function createOrEditTask(event) {
        event.preventDefault();

        if (taskToEdit === -1) {
            const _dueDateAsDate = new Date(`${taskDueDate.value}T00:00`);
            const _newTask = new Task(taskTitle.value, _dueDateAsDate, taskPriority.value);
            projectList[activeProject].addTask(_newTask);
        }
        else {
            projectList[activeProject].taskList[taskToEdit].title = taskTitle.value;
            projectList[activeProject].taskList[taskToEdit].notes = taskNotes.value;
            projectList[activeProject].taskList[taskToEdit].dueDate = new Date(`${taskDueDate.value}T00:00`);
            projectList[activeProject].taskList[taskToEdit].priority = taskPriority.value;
        }        
        
        refreshScreen();
        addTaskDialog.close();
    }

    function clearNodeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function toggleShowMore() {
        if (projectList[activeProject].taskList[this.value].showMore) {
            const todoIDSelector = "#todo-" + this.value + " textarea"
            const activeNotesNode = document.querySelector(todoIDSelector);
            projectList[activeProject].taskList[this.value].showMore = false;
            projectList[activeProject].taskList[this.value].notes = activeNotesNode.value
        }
        else {
            projectList[activeProject].taskList[this.value].showMore = true;
        }
        refreshScreen();
    }

    function toggleTaskComplete() {
        projectList[activeProject].taskList[this.value].toggleComplete();
    }

    function refreshScreen() {
        displayAllProjects(projectList);
        displayProjectTasks(projectList[activeProject]);
        setAllClickListeners();
    }

    function makeProjectActive() {
        activeProject = this.value;
        refreshScreen();
    }
})();