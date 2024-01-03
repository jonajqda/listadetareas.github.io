document.querySelector('#newtask input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

document.querySelector('#push').onclick = addTask;

function addTask() {
    var inputValue = document.querySelector('#newtask input').value;

    if (inputValue.length == 0) {
        alert("Por favor añade una tarea");
    } else {
        var newTaskHTML = `
            <div class="task" draggable="true">
                <span class="taskname">${inputValue}</span>
                <button class="delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>`;

        document.querySelector('#tasks').innerHTML += newTaskHTML;
        enableDragAndDrop();

        var currentTasks = document.querySelectorAll(".delete");
        currentTasks.forEach(function (task) {
            task.onclick = function () {
                showConfirmationModal(this.parentNode);
            };
        });

        var tasks = document.querySelectorAll(".task");
        tasks.forEach(function (task) {
            task.onclick = function () {
                this.classList.toggle('completed');
            };
        });

        document.querySelector("#newtask input").value = "";
    }
}

function showConfirmationModal(taskElement) {
    var modal = document.querySelector('#confirmationModal');
    modal.classList.add('show');

    document.querySelector('#confirmButton').onclick = function () {
        hideConfirmationModal();
        taskElement.remove();
    };

    document.querySelector('#cancelButton').onclick = function () {
        hideConfirmationModal();
    };
}

function hideConfirmationModal() {
    var modal = document.querySelector('#confirmationModal');
    modal.classList.remove('show');
}

function enableDragAndDrop() {
    const tasksContainer = document.getElementById('tasks');
    let draggedTask = null;

    tasksContainer.addEventListener('dragstart', (e) => {
        draggedTask = e.target.closest('.task');
        if (!draggedTask) return;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', null);
    });

    tasksContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetTask = e.target.closest('.task');
        const currentDragging = document.querySelector('.dragging');

        if (targetTask && targetTask !== currentDragging) {
            const rect = targetTask.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;

            if (next) {
                tasksContainer.insertBefore(draggedTask, targetTask.nextSibling);
            } else {
                tasksContainer.insertBefore(draggedTask, targetTask);
            }
        }
    });

    tasksContainer.addEventListener('dragend', () => {
        if (draggedTask) {
            draggedTask.classList.remove('dragging');
            draggedTask = null;
        }
    });
}
