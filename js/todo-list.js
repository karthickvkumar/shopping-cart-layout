var listOfTask = [];

function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}

function createTask() {
    var taskValue = document.getElementById('new-task').value;
    if (taskValue != '') {
        var id = generateGuid();
        var taskInfo = {
            "task": taskValue,
            "id": id,
            "isCompleted": false
        }
        listOfTask.push(taskInfo);
        var ulTag = document.getElementById('incomplete-tasks');
        var liTag = document.createElement('li');
        liTag.innerHTML = `
		<label id="task-name-` + id + `" onclick="onSelectTask(this)">` + taskValue + `</label>
        <button id="delete-task-` + id + `" class="delete" onclick="onDeleteTask(this)">Delete</button>`;
        ulTag.appendChild(liTag);
        document.getElementById('new-task').value = '';
        displayCount();
    } else {
        alert("Kindly enter a task");
    }
}

function onSelectTask(target) {
    var selectedID = target.id;
    var id = selectedID.replace('task-name-', '');
    listOfTask.forEach(function(task, index) {
        if (task.id == id) {
            task.isCompleted = !task.isCompleted;
        }
    });
    updateTaskList();
}

function onDeleteTask(target) {
    var deleteID = target.id;
    var id = deleteID.replace('delete-task-', '');
    listOfTask.forEach(function(task, index) {
        if (task.id == id) {
            listOfTask.splice(index, 1);
        }
    })
    updateTaskList();
}

function updateTaskList() {
    document.getElementById('incomplete-tasks').innerHTML = '';
    listOfTask.forEach(function(eachTask, index) {
        var ulTag = document.getElementById('incomplete-tasks');
        var liTag = document.createElement('li');
        liTag.innerHTML = `
		<label id="task-name-` + eachTask.id + `" class="` + (eachTask.isCompleted ? "completedTask" : "inCompleteTask") + `" onclick="onSelectTask(this)">` + eachTask.task + `</label>
	    <button id="delete-task-` + eachTask.id + `" class="delete" onclick="onDeleteTask(this)">Delete</button>`;
        ulTag.appendChild(liTag);
    });
    displayCount()
}

function displayCount() {
    var totalCount = listOfTask.length;
    document.getElementById('total-tasks-count').innerHTML = totalCount;
    var inCompleteCount = listOfTask.filter(function(task, index) {
        return task.isCompleted == false;
    })
    document.getElementById('incomplete-tasks-count').innerHTML = inCompleteCount.length;
    var completeCount = listOfTask.filter(function(task, index) {
        return task.isCompleted == true;
    })
    document.getElementById('complete-tasks-count').innerHTML = completeCount.length;
}