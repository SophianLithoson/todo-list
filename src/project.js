import {daysFromNow, formatDisplayedDate, formatShortDisplayDate} from "./date-fns-wrapper.js";

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

    get shortTitle() {
        if (this.title.length > 25) {
            return this.title.slice(0, 22) + "...";
        }
        else {
            return this.title;
        }
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

    getFilteredSummaryNode(criteria) {
        const _summaryNode = Object.assign(document.createElement("div"), {classList: "summary-node"});
        const _projectTitle = document.createElement("h3");
        const _numDaysAhead = (criteria === "Due Today") ? 0 : (criteria === "This Week") ? 6 : (criteria === "This Month") ? 29 : -Infinity;

        _projectTitle.style = "margin-bottom: 1rem;"
        _projectTitle.innerText = this.title;
        _summaryNode.appendChild(_projectTitle);
        
        for (let _i = 0; this.taskList[_i]; _i++) {
            if (daysFromNow(this.taskList[_i].dueDate) < _numDaysAhead) {
                const _taskToAdd = document.createElement("div");
                const _taskName = document.createElement("p");
                const _taskDate = document.createElement("p");

                _taskToAdd.style = "display: flex; justify-content: space-between; gap: 2rem;"
                _taskName.innerText = this.taskList[_i].shortTitle;
                _taskDate.innerText = formatShortDisplayDate(this.taskList[_i].dueDate);
                _taskToAdd.appendChild(_taskName);
                _taskToAdd.appendChild(_taskDate);
                _summaryNode.appendChild(_taskToAdd);
            }
        }

        return _summaryNode;
    }
}

export {Task, Project};