// Academic Planner - task management with localStorage

var taskForm = document.getElementById('task-form');
var taskInput = document.getElementById('task-input');
var taskDate = document.getElementById('task-date');
var taskPriority = document.getElementById('task-priority');
var taskList = document.getElementById('task-list');
var taskCounter = document.getElementById('task-counter');
var clearCompletedBtn = document.getElementById('clear-completed');

var tasks = [];
var currentFilter = 'all';
var STORAGE_KEY = 'student_tasks';

// Filter buttons (exclude clear-completed button)
var filterButtons = document.querySelectorAll('.filter-btn:not(#clear-completed)');

function loadTasks() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
  } catch (err) {
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    // storage full or unavailable
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function addTask(title, dueDate, priority) {
  var newTask = {
    id: generateId(),
    title: title.trim(),
    dueDate: dueDate || null,
    priority: priority || 'medium',
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].completed = !tasks[i].completed;
      break;
    }
  }
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  var newTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== id) {
      newTasks.push(tasks[i]);
    }
  }
  tasks = newTasks;
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  var remaining = [];
  for (var i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) {
      remaining.push(tasks[i]);
    }
  }
  tasks = remaining;
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === 'pending') {
    var pending = [];
    for (var i = 0; i < tasks.length; i++) {
      if (!tasks[i].completed) pending.push(tasks[i]);
    }
    return pending;
  }
  if (currentFilter === 'completed') {
    var done = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].completed) done.push(tasks[i]);
    }
    return done;
  }
  return tasks;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderTasks() {
  var filtered = getFilteredTasks();

  var total = tasks.length;
  var pending = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) pending++;
  }
  if (taskCounter) {
    taskCounter.textContent = total === 0
      ? 'No tasks yet'
      : pending + ' pending of ' + total + ' total';
  }

  if (filtered.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks to show. Add one above to get started!</li>';
    return;
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var task = filtered[i];
    var completedClass = task.completed ? ' completed' : '';
    var checked = task.completed ? 'checked' : '';
    var titleStyle = task.completed ? 'text-decoration:line-through;' : '';
    var dateStr = task.dueDate ? 'Due: ' + formatDate(task.dueDate) : '';
    var priorityClass = 'priority-' + task.priority;
    var priorityLabel = task.priority[0].toUpperCase() + task.priority.slice(1);

    html += '<li class="task-item' + completedClass + '" data-id="' + task.id + '">';
    html += '<input type="checkbox" class="task-checkbox" ' + checked + ' />';
    html += '<div class="task-info">';
    html += '<p class="task-title" style="' + titleStyle + '">' + escapeHtml(task.title) + '</p>';
    html += '<div class="task-meta">';
    html += '<span class="' + priorityClass + '">' + priorityLabel + ' Priority</span>';
    if (dateStr) html += ' &middot; <span>' + dateStr + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<button class="task-delete">Delete</button>';
    html += '</li>';
  }
  taskList.innerHTML = html;

  attachTaskListeners();
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function attachTaskListeners() {
  var checkboxes = document.querySelectorAll('.task-checkbox');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function (e) {
      var taskItem = e.target.parentNode;
      var id = taskItem.getAttribute('data-id');
      toggleTask(id);
    });
  }

  var deleteBtns = document.querySelectorAll('.task-delete');
  for (var j = 0; j < deleteBtns.length; j++) {
    deleteBtns[j].addEventListener('click', function (e) {
      var taskItem = e.target.parentNode;
      var id = taskItem.getAttribute('data-id');
      if (confirm('Delete this task?')) {
        deleteTask(id);
      }
    });
  }
}

function setFilter(filter) {
  currentFilter = filter;
  for (var i = 0; i < filterButtons.length; i++) {
    var btn = filterButtons[i];
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
  renderTasks();
}

// Event listeners
if (taskForm) {
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = taskInput.value.trim();
    if (!title) {
      alert('Please enter a task title.');
      return;
    }
    addTask(title, taskDate.value, taskPriority.value);
    taskForm.reset();
    taskInput.focus();
  });
}

for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function () {
    setFilter(this.getAttribute('data-filter'));
  });
}

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', function () {
    var hasCompleted = false;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].completed) {
        hasCompleted = true;
        break;
      }
    }
    if (!hasCompleted) {
      alert('No completed tasks to clear.');
      return;
    }
    if (confirm('Clear all completed tasks?')) {
      clearCompleted();
    }
  });
}

// Initial render
loadTasks();

if (tasks.length === 0) {
  tasks = [
    {
      id: generateId(),
      title: 'Complete COS 106 Term Project',
      dueDate: null,
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Review JavaScript arrays and functions',
      dueDate: null,
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
  saveTasks();
}

renderTasks();
