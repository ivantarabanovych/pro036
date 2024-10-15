const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const apiUrl = 'http://localhost:3000/tasks';

async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    
    const tasks = await response.json();
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.status}</td>
      <td>
          <button onclick="updateTask(${task.id}, '${task.status}')">Toggle status</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
      </td>
      `;
      taskList.appendChild(row);
    });
  } catch (error) {
    displayError('Error fetching tasks: ' + error.message);
  }
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!title || !description) {
      displayError('Both title and description are required!');
      return;
    }

    const newTask = {
      title,
      description,
      status: 'pending'
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      fetchTasks(); 
      taskForm.reset(); 
    } catch (error) {
      displayError('Error adding task: ' + error.message);
    }
});

async function updateTask(id, currentStatus) {
  const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error('Failed to update task status');
    
    fetchTasks(); 
  } catch (error) {
    displayError('Error updating task status: ' + error.message);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete task');
    
    fetchTasks(); 
  } catch (error) {
    displayError('Error deleting task: ' + error.message);
  }
}

function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.textContent = message;

  taskForm.parentNode.insertBefore(errorDiv, taskForm);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

fetchTasks();