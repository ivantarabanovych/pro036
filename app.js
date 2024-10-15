const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const apiUrl = 'http://localhost:3000/tasks';

async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();
  
  taskList.innerHTML = ''; 
  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${task.title}</td>
    <td>${task.description}</td>
    <td>${task.status}</td>
    <td>
        <button onclick="(updateTask${task.id}, '${task.status}')">Togle status</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
    </td>
    `;
    taskList.appendChild(row)
  });
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        status: 'pending'
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });

    if(response.ok){
      fetchTasks();
      taskForm.reset();
    }
});

async function updateTask(id, currentStatus) {
  const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

  await fetch(`${apiUrl}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: newStatus })
  });

  fetchTasks(); 
}

async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  });

  fetchTasks(); 
}

fetchTasks();