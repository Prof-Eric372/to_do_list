const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filters button');
const themeToggle = document.getElementById('toggle-theme');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, done: false });
    input.value = '';
    saveAndRender();
  }
});

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks(filter = 'all') {
  list.innerHTML = '';
  tasks.forEach((task, i) => {
    if (
      filter === 'active' && task.done ||
      filter === 'done' && !task.done
    ) return;

    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[i].done = !tasks[i].done;
      saveAndRender();
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.text;
      li.replaceChild(editInput, span);
      editInput.focus();
      editInput.addEventListener('blur', () => {
        tasks[i].text = editInput.value;
        saveAndRender();
      });
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(i, 1);
      saveAndRender();
    });

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });
}

// Filtros
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

// Dark mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Inicializar
renderTasks();

