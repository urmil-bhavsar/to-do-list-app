//variable to contain all the lists
const listsContainer = document.querySelector("[data-lists]");

// varialbles to select the list input
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedlistsId";
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

//
// variable which contains the list items
// get this info from the local storage using this key and parse it into an object as it is a string right now...if it doesnt exist give us an empty array
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

//
//
//
//adding event listener to the whole list container
listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    // console.log(selectedListId);
    saveAndRender();
  }
});

//
//
//adding event listener to the task container......e means event
tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

//
//
//
clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

//
//
//adding event listener to the delete list button
deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  //   console.log(lists);
  selectedListId = null;
  saveAndRender();
});

//
//
//adding event listener to the newListForm field and creating the list item
newListForm.addEventListener("submit", (e) => {
  e.preventDefault(); //it will prevent the form to submit itself  and refresh the page
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);

  //setting the value of the newly added list item to null after clicking the add button
  newListInput.value = null;
  lists.push(list);
  openTodoListContainer(list.id); // open the to-do list container for the new list
  saveAndRender();
});

//
//
// function to open the todo container respective to the newly added list
function openTodoListContainer(listId) {
  selectedListId = listId;
  listDisplayContainer.style.display = "";
  saveAndRender();
}
//
//
//adding event listener to the newtaskfrom field and creating the tasks
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //it will prevent the form to submit itself  and refresh the page
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  //setting the value of the newly added list item to null after clicking the add button
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

//
//
//function to create the list
function createList(name) {
  //here data object is used to assign unique id to each list item
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

//
//
function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false, // bcz by default the task is incomplete
  };
}
//
//
//a function to all the save and render functions
function saveAndRender() {
  save();
  render();
}

//
//save function to save items in the local storage
function save() {
  //storing list items in the local stoage as json strings
  //key: value pairs
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

//
//
//
//render function to create list elements and give them properties
function render() {
  //function call to clear list
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null || selectedList == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

//
//
// render function to create list elements and give them properties
function renderLists() {
  //appending the list items to the list container
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

//
//
//
//function to render tasks and display them on the screen
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true); //true means the descendants will also be included
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id; //setting the for attribute of the label
    label.append(task.name);
    taskElement.querySelector(".task").setAttribute("data-task-id", task.id);

    tasksContainer.appendChild(taskElement);
  });
}

//
//
//
//function  to display the remaining task count
function renderTaskCount(selectedList) {
  //   console.log("hey" + selectedList.tasks);
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

//
//
//
//function to clear list
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//
//
//
//edit task button event listener
tasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-task-button")) {
    // Retrieve the task element and its associated data
    const taskElement = e.target.closest(".task");
    const taskId = taskElement.dataset.taskId;
    const taskLabel = taskElement.querySelector("label");

    // Check if the task is complete before allowing the edit
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find((task) => task.id === taskId);

    if (selectedTask.complete) {
      // Task is complete, prevent editing
      alert("You cannot edit a completed task.");
      return;
    }
    // Create the editInput field with the same class as the task input
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("new");
    editInput.value = taskLabel.innerText;

    // Replace the task label with the editInput and add the save button
    taskLabel.replaceWith(editInput);

    // show the cancel button and hide the edit button
    const editButton = taskElement.querySelector(".edit-task-button");

    // Add event listener to save changes when Enter key is pressed
    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // Update the task name and save
        const selectedList = lists.find((list) => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(
          (task) => task.id === taskId
        );
        selectedTask.name = editInput.value;
        saveAndRender();
      }
    });

    editInput.focus();
  }
});

//
//
//
// event listener for the delete button
tasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task-button")) {
    // Retrieve the task element and its associated data
    const taskElement = e.target.closest(".task");
    const taskId = taskElement.dataset.taskId;

    // Remove the task from the selected list and save
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(
      (task) => task.id !== taskId
    );
    saveAndRender();
  }
});

render();
