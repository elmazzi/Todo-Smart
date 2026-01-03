
let tasks = [];
let currentFilter = "all";

const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");

const STORAGE_KEY = "todo_smart_tasks_v1";

function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem(STORAGE_KEY, json);
}

function load() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json) {
    try {
      tasks = JSON.parse(json);
    } catch (e) {
      tasks = [];
    }
  }
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.done);
  }
  if (currentFilter === "done") {
    return tasks.filter(task => task.done);
  }
  return tasks; // "all"
}

function updateCounter() {
  const remaining = tasks.filter(task => !task.done).length;
  counter.textContent = `${remaining} restante${remaining > 1 ? 's' : ''}`;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "item";
  if (task.done) {
    li.classList.add("done");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("click", () => toggleTask(task.id));

  const span = document.createElement("span");
  span.className = "text";
  span.textContent = task.text;

  const spacer = document.createElement("span");
  spacer.className = "spacer";

  const deleteBtn = document.createElement("button");
  //deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "supprimer";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(spacer);
  li.appendChild(deleteBtn);

  return li;
}

function render() {
  taskList.innerHTML = "";

  const visible = getVisibleTasks();

  visible.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateCounter();
}


function addTask(text) {
  const trimmed = text.trim();
  
  if (trimmed === "") {
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text: trimmed,
    done: false
  };

  tasks.push(newTask);

  save();
  render();
}


function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    render();
  }
}


function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}


function setActiveFilterButton(activeBtn) {
  filterBtns.forEach(btn => btn.classList.remove("is-active"));
  activeBtn.classList.add("is-active");
}


addBtn.addEventListener("click", () => {
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});


taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  }
});


filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    setActiveFilterButton(btn);
    render();
  });
});


clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  save();
  render();
});


clearAllBtn.addEventListener("click", () => {
  tasks = [];
  save();
  render();
});


load();
render();