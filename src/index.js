import {dateToDateString} from "./date-fns-wrapper";
import {Project, Task} from "./project";
import {storageExists, saveProject, loadAllProjects, clearStorage} from "./localstorage";
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
    
    let projectList = [];                                                 // global vars
    let activeProjectIndex = 0;
    let taskToEdit = -1;
    let projectToEdit = -1;

    if (storageExists()) {
        projectList = loadAllProjects();
    }

    else {
        projectList = createDefaultProjectList();
    }

    
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

        const _editTaskButtons = document.getElementsByClassName("edit-task-button");

        for (let _k = 0; _editTaskButtons.item(_k); _k++) {
            _editTaskButtons.item(_k).value = _k;
            _editTaskButtons.item(_k).addEventListener("click", editTaskDialog);
        }

        const _deleteButtons = document.getElementsByClassName("delete-button");

        for (let _m = 0; _deleteButtons.item(_m); _m++) {
            _deleteButtons.item(_m).value = _m;
            _deleteButtons.item(_m).addEventListener("click", removeTask);
        }

        const _showMoreButtons = document.getElementsByClassName("show-more-button");

        for (let _n = 0; _showMoreButtons.item(_n); _n++) {
            _showMoreButtons.item(_n).value = _n;
            _showMoreButtons.item(_n).addEventListener("click", toggleShowMore);
        }

        const _taskCheckboxes = document.getElementsByClassName("todo-checkbox");

        for (let _p = 0; _taskCheckboxes.item(_p); _p++) {
            _taskCheckboxes.item(_p).value = _p;
            _taskCheckboxes.item(_p).addEventListener("click", toggleTaskComplete);
        }
    }

    function setNavClickListeners() {
        const _projectListSpans = document.getElementsByClassName("project-title-span");

        for (let _r = 0; _projectListSpans.item(_r); _r++) {
            _projectListSpans.item(_r).value = _r;
            _projectListSpans.item(_r).addEventListener("click", makeProjectActive);
        }

        const _projectDeleteIcons = document.getElementsByClassName("delete-project-button");

        for (let _q = 0; _projectDeleteIcons.item(_q); _q++) {
            _projectDeleteIcons.item(_q).value = _q;
            _projectDeleteIcons.item(_q).addEventListener("click", removeProject);
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
        const _p = projectList[activeProjectIndex];

        projectTitle.value = _p.title;
        projectDescription.value = _p.description
        projectToEdit = activeProjectIndex;

        addProjectDialog.showModal();
    }

    function removeProject() {
        projectList.splice(this.value, 1);

        if (projectList[this.value]) {
            activeProjectIndex = this.value;
        }
        else if (projectList[this.value - 1]) {
            activeProjectIndex = this.value - 1;
        }
        else {
            activeProjectIndex = -1;
        }

        saveAllProjects();
        refreshScreen();
    }
    
    function createOrEditProject(event) {
        event.preventDefault();

        if (projectToEdit === -1) {
            const _newProject = new Project(projectTitle.value, projectDescription.value);
            projectList.push(_newProject);
            activeProjectIndex = projectList.length - 1;
        }
        else {
            projectList[projectToEdit].title = projectTitle.value;
            projectList[projectToEdit].description = projectDescription.value;
        }

        saveAllProjects();
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
        const _t = projectList[activeProjectIndex].taskList[this.value];

        taskTitle.value = _t.title;
        taskDueDate.value = dateToDateString(_t.dueDate);
        taskPriority.value = _t.priority;
        taskToEdit = this.value;

        addTaskDialog.showModal();
    }

    function removeTask() {
        projectList[activeProjectIndex].deleteTask(this.value);
        saveProject(activeProjectIndex, projectList[activeProjectIndex]);
        refreshScreen();
    }
    
    function createOrEditTask(event) {
        event.preventDefault();

        if (taskToEdit === -1) {
            const _dueDateAsDate = new Date(`${taskDueDate.value}T00:00`);
            const _newTask = new Task(taskTitle.value, _dueDateAsDate, taskPriority.value);
            projectList[activeProjectIndex].addTask(_newTask);
        }
        else {
            projectList[activeProjectIndex].taskList[taskToEdit].title = taskTitle.value;
            projectList[activeProjectIndex].taskList[taskToEdit].dueDate = new Date(`${taskDueDate.value}T00:00`);
            projectList[activeProjectIndex].taskList[taskToEdit].priority = taskPriority.value;
        }        
        
        saveProject(activeProjectIndex, projectList[activeProjectIndex]);
        refreshScreen();
        addTaskDialog.close();
    }

    function clearNodeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function toggleShowMore() {
        if (projectList[activeProjectIndex].taskList[this.value].showMore) {
            const _todoIDSelector = `#todo-${this.value} textarea`;
            const _activeNotesNode = document.querySelector(_todoIDSelector);
            projectList[activeProjectIndex].taskList[this.value].showMore = false;
            projectList[activeProjectIndex].taskList[this.value].notes = _activeNotesNode.value;
            saveProject(activeProjectIndex, projectList[activeProjectIndex]);
        }
        else {
            projectList[activeProjectIndex].taskList[this.value].showMore = true;
        }
        refreshScreen();
    }

    function toggleTaskComplete() {
        projectList[activeProjectIndex].taskList[this.value].toggleComplete();
        saveProject(activeProjectIndex, projectList[activeProjectIndex]);
    }

    function refreshScreen() {
        displayAllProjects(projectList);
        setNavClickListeners();
        setSelectedNavItem();

        if (activeProjectIndex === "Due Today" || activeProjectIndex === "This Week" || activeProjectIndex === "This Month") {
            displayFilteredTasks(activeProjectIndex);
            setSortedViewListeners();
        }
        else {
            displayProjectTasks(projectList[activeProjectIndex]);
            setTaskViewListeners();
        }        
    }

    function makeProjectActive(event) {
        if (this.id === "time-filtered-container") {
            activeProjectIndex = event.target.innerText;
        }
        else {
            activeProjectIndex = this.value;
        }
        refreshScreen();
    }

    function displayFilteredTasks(criteria) {
        clearNodeChildren(projectHeaderNode);
        clearNodeChildren(todoContainerNode);
        buttonAddTask.style.display = "none";

        const _filteredHeader = document.createElement("h2");
        _filteredHeader.innerText = criteria;
        projectHeaderNode.appendChild(_filteredHeader);
        todoContainerNode.classList.remove("listed-projects");
        todoContainerNode.classList.add("filtered-projects");

        for (let _i = 0; projectList[_i]; _i++) {
            todoContainerNode.appendChild(projectList[_i].getFilteredSummaryNode(criteria));
        }
    }

    function setSelectedNavItem() {
        const _allListItems = document.getElementsByTagName("li");

        for (let listItem of _allListItems) {
            if (listItem.innerHTML.includes(activeProjectIndex)) {
                listItem.classList.add("selected");
            }
            else {
                listItem.classList.remove("selected");
            }
        }
    }

    function setSortedViewListeners() {
        const _allSummaryNodes = document.getElementsByClassName("summary-node");

        for (let _i = 0; _allSummaryNodes.item(_i); _i++) {
            _allSummaryNodes.item(_i).value = _i;
            _allSummaryNodes.item(_i).addEventListener("click", makeProjectActive);
        }
    }

    function createDefaultProjectList() {
        const _projectList = [];
        const _defaultProject = new Project("Default", "This is the default project. Click the pencil above to edit.");
        const _firstTask = new Task("Low Priority", new Date(2024, 5, 4), "low-priority");
        const _secondTask = new Task("Medium Priority, due soon", new Date(Date.now()), "medium-priority");
        const _thirdTask = new Task("High priority, past due date", new Date(2023, 9, 30), "high-priority");

        _defaultProject.addTask(_firstTask);
        _defaultProject.addTask(_secondTask);
        _defaultProject.addTask(_thirdTask);
        _projectList.push(_defaultProject);

        return _projectList;
    }

    function saveAllProjects() {
        clearStorage();
        for (let _i = 0; projectList[_i]; _i++) {
            saveProject(_i, projectList[_i]);
        }
    }
})();