class UI {
  constructor() {
    this.mode = document.getElementById("mode");
    this.body = document.querySelector("body");
    this.form = document.querySelector(".input-box");
    this.tasksBox = document.querySelector(".tasks-box");
    this.input = document.querySelector("#input");
    this.middle = document.querySelector(".middle");
    this.count = document.querySelector("#tasks-num");

    this.all = document.getElementById("all");
    this.done = document.getElementById("done");
    this.left = document.getElementById("left");
  }

  makeLight() {
    this.mode.setAttribute("src", "./images/icon-moon.svg");
    this.mode.classList.add("sun");
    this.body.style.backgroundColor = "hsl(0, 0%, 98%)";
    this.body.style.backgroundImage = "url(../images/bg-desktop-light.jpg)";

    this.tasksBox.style.backgroundColor = "white";
  }

  makeDark() {
    this.mode.setAttribute("src", "./images/icon-sun.svg");
    this.mode.classList.remove("sun");
    this.body.style.backgroundColor = "hsl(237, 14%, 26%)";
    this.body.style.backgroundImage = "url(../images/bg-desktop-dark.jpg)";

    this.tasksBox.style.backgroundColor = "rgb(223, 217, 217)";
  }

  addTask() {
    let text = this.input.value;
    const div = document.createElement("div");
    div.className = "task-row";
    div.innerHTML = ` <div>
    <i class="far fa-circle state"></i>
    <p>${text}</p>
  </div>
  <i class="far fa-times-circle delete"></i>`;

    const parent = document.querySelector(".tasks-box");
    const refElement = document.querySelector(".info");

    parent.insertBefore(div, refElement);
    this.input.value = "";
    this.showAll();
    this.setCount();
  }

  showMssg(mssg, color) {
    const div = document.querySelector(".mssg");
    div.style.backgroundColor = color;
    div.textContent = mssg;
    div.style.visibility = "visible";
    setTimeout(function () {
      div.style.visibility = "hidden";
    }, 2000);
  }

  deleteTask(task) {
    task.remove();
    this.showMssg("با موفقیت حذف شد.", "green");
    this.setCount();
  }

  changeState(state) {
    if (state.parentElement.parentElement.classList.contains("done")) {
      state.parentElement.parentElement.classList.remove("done");
      state.className = "far fa-circle state";
      this.setCount();
    } else {
      state.parentElement.parentElement.classList.add("done");
      state.className = "fas fa-check-circle state";
      this.showMssg("هوررا... تمام شد!", "green");
      this.setCount();
    }
  }

  clearTasks() {
    const tasks = document.querySelectorAll(".task-row");
    tasks.forEach((task) => {
      if (task.style.display === "flex") {
        Store.deleteTask(task.firstElementChild.lastElementChild);
        task.remove();
      }
    });
    this.showMssg("همه موارد حذف شدند.", "green");
    this.setCount();
  }

  setCount() {
    const tasks = document.querySelectorAll(".task-row");
    const dones = document.querySelectorAll(".done");

    this.count.textContent = tasks.length - dones.length;
  }

  showAll() {
    this.all.className = "active";
    this.done.className = "";
    this.left.className = "";

    const tasks = document.querySelectorAll(".task-row");
    tasks.forEach((task) => {
      task.style.display = "flex";
    });
  }

  showDone() {
    this.all.className = "";
    this.done.className = "active";
    this.left.className = "";

    const tasks = document.querySelectorAll(".task-row");
    tasks.forEach((task) => {
      if (task.classList.contains("done")) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  }

  showLeft() {
    this.all.className = "";
    this.done.className = "";
    this.left.className = "active";

    const tasks = document.querySelectorAll(".task-row");
    tasks.forEach((task) => {
      if (task.classList.contains("done")) {
        task.style.display = "none";
      } else {
        task.style.display = "flex";
      }
    });
  }

  addFromLS(task) {
    const div = document.createElement("div");
    if (task.state === "left") {
      div.className = "task-row";
      div.innerHTML = ` <div>
      <i class="far fa-circle state"></i>
      <p>${task.text}</p>
    </div>
    <i class="far fa-times-circle delete"></i>`;
    } else {
      div.className = "task-row done";
      div.innerHTML = ` <div>
      <i class="fas fa-check-circle state"></i>
      <p>${task.text}</p>
    </div>
    <i class="far fa-times-circle delete"></i>`;
    }

    const parent = document.querySelector(".tasks-box");
    const refElement = document.querySelector(".info");

    parent.insertBefore(div, refElement);
    this.showAll();
    this.setCount();
  }
}

class Store {
  constructor() {}

  static getData() {
    let tasks;
    let mode;

    if (localStorage.getItem("todo-tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("todo-tasks"));
    }

    if (localStorage.getItem("todo-mode") === null) {
      mode = "light";
    } else {
      mode = localStorage.getItem("todo-mode");
    }

    return { tasks, mode };
  }

  static paintUI() {
    const data = Store.getData();
    const ui = new UI();

    if (data.mode === "light") {
      ui.makeLight();
    } else {
      ui.makeDark();
    }

    data.tasks.forEach((task) => {
      ui.addFromLS(task);
    });
  }

  static addTaskToLS(textt) {
    let data = Store.getData();
    const task = {
      text: textt,
      state: "left",
    };

    data.tasks.push(task);
    localStorage.setItem("todo-tasks", JSON.stringify(data.tasks));
  }

  static deleteTask(pElement) {
    let data = Store.getData();
    data.tasks.forEach((task, index) => {
      if (task.text === pElement.innerHTML) {
        data.tasks.splice(index, 1);
      }
    });

    localStorage.setItem("todo-tasks", JSON.stringify(data.tasks));
  }

  static changeState(pElement) {
    let data = Store.getData();
    data.tasks.forEach((task) => {
      if (task.text === pElement.innerHTML) {
        if (task.state === "left") {
          task.state = "done";
        } else {
          task.state = "left";
        }
      }
    });

    localStorage.setItem("todo-tasks", JSON.stringify(data.tasks));
  }
}

document.addEventListener("DOMContentLoaded", Store.paintUI());
const ui = new UI();
ui.mode.addEventListener("click", chageMode);
ui.form.addEventListener("submit", addTask);
ui.tasksBox.addEventListener("click", checkTarget);

function chageMode(e) {
  if (e.target.classList.contains("sun")) {
    ui.makeDark();
    localStorage.setItem("todo-mode", "dark");
  } else {
    ui.makeLight();
    localStorage.setItem("todo-mode", "light");
  }
}

function addTask(e) {
  if (ui.input.value === "" || ui.input.value === " ") {
    ui.showMssg("عنوان را وارد کنید.", "red");
  } else {
    Store.addTaskToLS(ui.input.value);
    ui.addTask();
    ui.showMssg("با موفقیت اضافه شد.", "green");
  }

  e.preventDefault();
}

function checkTarget(e) {
  if (e.target.classList.contains("delete")) {
    Store.deleteTask(e.target.parentElement.firstElementChild.lastElementChild);
    ui.deleteTask(e.target.parentElement);
  }

  if (e.target.classList.contains("state")) {
    Store.changeState(e.target.nextElementSibling);
    ui.changeState(e.target);
  }

  if (e.target.id === "clear-tasks") {
    if (confirm("آیا مایل به حذف همه کارها هستید؟")) {
      ui.clearTasks();
    }
  }

  if (e.target.id === "all") {
    ui.showAll();
  }

  if (e.target.id === "done") {
    ui.showDone();
  }

  if (e.target.id === "left") {
    ui.showLeft();
  }
}
