import {Project, Task} from "./project.js";

function storageExists() {
    if (window.localStorage.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function saveProject(key, project) {
    window.localStorage.setItem(key, JSON.stringify(project));
}

function clearStorage() {
    window.localStorage.clear();
}

function loadAllProjects() {
    const _projectList = [];

    for (let _i=0; _i < window.localStorage.length; _i++) {
        const _objectProperties = JSON.parse(window.localStorage.getItem(_i));
        const _project = Object.assign(new Project(), _objectProperties);

        for (let _j = 0; _project.taskList[_j]; _j++) {
            _project.taskList[_j] = Object.assign(new Task(), _project.taskList[_j]);
            _project.taskList[_j].dueDate = new Date(_project.taskList[_j].dueDate);
        }

        _projectList.push(_project);
    }

    return _projectList;
}

export {storageExists, saveProject, loadAllProjects, clearStorage};