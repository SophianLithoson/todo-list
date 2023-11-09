import {dateToDateString} from "./date-fns-wrapper.js";
import {Project, Task} from "./project.js";
import {storageExists, saveProject, loadAllProjects} from "./localstorage.js";
import "./style.css";

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

    

    console.log(JSON.stringify(projectList[activeProject]));
    saveProject(activeProject, projectList[activeProject]);
    const testRecoveredProjects = loadAllProjects();
    projectList.push(testRecoveredProjects[0]);
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

        todoContainerNode.classList.remove("filtered-projects");
        todoContainerNode.classList.add("listed-projects");
    
        for (let _j = 0; _projectTaskNodes[_j]; _j++) {
            todoContainerNode.appendChild(_projectTaskNodes[_j]);
        }
        
        buttonAddTask.style.display = "flex";
    }

    function setTaskViewListeners() {
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
    }

    function setNavClickListeners() {
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

        const dashboardContainer = document.getElementById("time-filtered-container");
        dashboardContainer.addEventListener("click", makeProjectActive);
        
    }
    
    function displayAllProjects(projectsArray) {
        clearNodeChildren(projectContainer);
        
        for (let _i = 0; projectsArray[_i]; _i++) {
            const _projectToAdd = projectsArray[_i].getProjectTitleNode();
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
        setNavClickListeners();
        setSelectedNavItem();

        if (activeProject === "Due Today" || activeProject === "This Week" || activeProject === "This Month") {
            displayFilteredTasks(activeProject);
            setSortedViewListeners();
        }
        else {
            displayProjectTasks(projectList[activeProject]);
            setTaskViewListeners();
        }        
    }

    function makeProjectActive(event) {
        if (this.id === "time-filtered-container") {
            activeProject = event.target.innerText;
        }
        else {
            activeProject = this.value;
        }
        refreshScreen();
    }

    function displayFilteredTasks(criteria) {
        clearNodeChildren(projectHeaderNode);
        clearNodeChildren(todoContainerNode);
        buttonAddTask.style.display = "none";

        const filteredHeader = document.createElement("h2");
        filteredHeader.innerText = criteria;
        projectHeaderNode.appendChild(filteredHeader);
        todoContainerNode.classList.remove("listed-projects");
        todoContainerNode.classList.add("filtered-projects");

        for (let _i = 0; projectList[_i]; _i++) {
            todoContainerNode.appendChild(projectList[_i].getFilteredSummaryNode(criteria));
        }
    }

    function setSelectedNavItem() {
        const allListItems = document.getElementsByTagName("li");

        for (let listItem of allListItems) {
            if (listItem.innerHTML.includes(activeProject)) {
                listItem.classList.add("selected");
            }
            else {
                listItem.classList.remove("selected");
            }
        }
    }

    function setSortedViewListeners() {
        const allSummaryNodes = document.getElementsByClassName("summary-node");

        for (let _i = 0; allSummaryNodes.item(_i); _i++) {
            allSummaryNodes.item(_i).value = _i;
            allSummaryNodes.item(_i).addEventListener("click", makeProjectActive);
        }
    }
})();