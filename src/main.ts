import "./style.css";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
import { v4 } from "uuid";

const taskForm = document.querySelector<HTMLFormElement>("#taskForm");

const tasksList = document.querySelector<HTMLDivElement>("#tasksList");

/* asi es como definito la estructura de un objeto en typescript */
interface Task {
  id: string;
  title: string;
  description: string;
}

/* creamos un arreglo que tendra un arreglo del objeto definido */
let tasks: Task[] = [];

/* cada elemento de html tiene un addListener, por ende agarramos el submit del formulario */
taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;

  tasks.push({
    title: title.value,
    description: description.value,
    id: v4(),
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  Toastify({
    text: "Task added",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  renderTasks(tasks);
  taskForm.reset();
  title.focus();
});

/* recibir los task guardador en el localStorage */
document.addEventListener("DOMContentLoaded", () => {
  /* el parse debe que recibo un string y debo modificarlo a su formato original */
  /* y como a veces no podemos tener cosas en localStorage que siempre devuelva un arreglo vacio */
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks(tasks);
});

function renderTasks(tasks: Task[]) {
  tasksList!.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-900 mb-1 p-4 rounded-lg hover:bg-zinc-800 hover:cursor-pointer";

    const header = document.createElement("header");
    header.className = "flex justify-between";

    const title = document.createElement("span");
    title.innerText = task.title;

    const btnDelete = document.createElement("button");
    btnDelete.className = "bg-red-500 px-2 py-1 rounded-md";
    btnDelete.innerText = "Delete";
    btnDelete.addEventListener("click", () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
    });

    header.append(title);
    header.append(btnDelete);

    const description = document.createElement("p");
    description.innerText = task.description;

    taskElement.append(header);
    taskElement.append(description);

    const id = document.createElement('p')
    id.innerText = task.id
    id.className = ' text-ggray-400 text-xs'
    taskElement.append(id)

    tasksList?.append(taskElement);
  });
}
