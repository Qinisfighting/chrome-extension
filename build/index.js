"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//to do list
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const totalTasks = document.querySelector(".total-tasks span");
const completedTasks = document.querySelector(".completed-tasks span");
const remainingTasks = document.querySelector(".remaining-tasks span");
let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
        createTask(task);
    });
}
// submit form
todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("input");
    let inputValue = document.getElementById("input").value;
    if (inputValue != "") {
        const task = {
            id: new Date().getTime(),
            name: inputValue,
            isCompleted: false
        };
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        createTask(task);
        input.reset();
    }
    input.focus();
});
// remove task
todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-task") ||
        e.target.parentElement.classList.contains("remove-task")) {
        const taskId = e.target.closest("li").id;
        removeTask(taskId);
    }
});
// update task - change status or name
todoList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTask(taskId, e.target);
});
// prevent new lines with Enter
todoList.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});
// create task
function createTask(task) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.id);
    const taskElMarkup = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="${task.name}-${task.id}" name="tasks" ${task.isCompleted ? "checked" : ""}>
        
        <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
      </div>
      <button class="remove-task" title="Remove ${task.name} task">
      ✖️
      </button>
    `;
    taskEl.innerHTML = taskElMarkup;
    todoList.appendChild(taskEl);
    countTasks();
}
// remove task
function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const eleToDelete = document.getElementById(taskId);
    eleToDelete.remove();
    countTasks();
}
// update task
function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId));
    if (el.hasAttribute("contentEditable")) {
        task.name = el.textContent;
    }
    else {
        const span = el.nextElementSibling
            .nextElementSibling;
        task.isCompleted = !task.isCompleted;
        if (task.isCompleted) {
            span.removeAttribute("contenteditable");
            el.setAttribute("checked", "");
        }
        else {
            el.removeAttribute("checked");
            span.setAttribute("contenteditable", "");
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    countTasks();
}
function countTasks() {
    totalTasks.textContent = tasks.length;
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
    completedTasks.textContent =
        completedTasksArray.length;
    remainingTasks.textContent =
        tasks.length - completedTasksArray.length;
}
//background
function setbackgroundImage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature");
            const data = yield res.json();
            const imgURL = data.urls.full;
            const imgAuthor = data.user.name;
            const myBG = document.getElementById("img-author"); //The ! means "trust me, this is not a null reference"
            document.body.style.backgroundImage = `url(${imgURL})`;
            myBG.innerHTML = `<p>Photographer: ${imgAuthor}</p>`;
        }
        catch (error) {
            console.log("Fetch background IMG error -", error);
        }
    });
}
setbackgroundImage();
function getDateTime() {
    const today = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const date = today.toLocaleDateString("de-DE", options);
    const time = today.toLocaleTimeString("de-DE");
    const myTime = document.getElementById("time");
    myTime.innerHTML = `<h1>${time}</h1>
                        <p>${date}</p>`;
}
setInterval(getDateTime, 1000);
//weather
navigator.geolocation.getCurrentPosition((pos) => {
    function getWeather() {
        return __awaiter(this, void 0, void 0, function* () {
            const APIKey = "b0c6dd1560b603095aed754d5d1756d0";
            const APIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${APIKey}&units=metric`;
            try {
                const res = yield fetch(APIUrl);
                const data = yield res.json();
                const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                console.log(data);
                const myWeather = document.getElementById("weather");
                const myLocation = document.getElementById("location");
                myWeather.innerHTML = `<img src=${iconURL}><h2>${Math.round(data.main.temp)}°C `;
                myLocation.textContent = `${data.name}`;
            }
            catch (error) {
                console.log("error", error);
            }
        });
    }
    getWeather();
});
//quote
function getQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("https://raw.githubusercontent.com/Qinisfighting/Assets-for-all/main/quotes.json");
            const data = yield res.json();
            let randomIndex = Math.floor(Math.random() * data.length);
            let quote = data[randomIndex];
            const myQuote = document.getElementById("quote");
            myQuote.innerHTML = `<h3>${quote.q}</h3><p> - ${quote.a}</p>`;
        }
        catch (error) {
            console.log("Fetch coin error -", error);
        }
    });
}
getQuotes();
