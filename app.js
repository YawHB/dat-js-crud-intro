// ============ GLOBAL VARIABELS ============ //
"strict user";
const endpoint =
  "https://race-dat-v2-default-rtdb.europe-west1.firebasedatabase.app"; // To do: paste url to endpoint
let selectedUser;

// ============ READ ============ //
// Read (GET) all users from Firebase (Database) using REST API
async function readUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = Object.keys(data).map((key) => ({ id: key, ...data[key] })); // from object to array
  const filteredUsers = users.filter((user) => user.title);
  //filteredUsers.sort((user, user));
  return filteredUsers;
}

// Create HTML and display all users from given list
function displayUsers(list) {
  // reset <section id="users-grid" class="grid-container">...</section>
  document.querySelector("#users-grid").innerHTML = "";
  //loop through all users and create an article with content for each
  for (const user of list) {
    document.querySelector("#users-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article>
                 <img src="${user.image}">
                <h2>${user.name}</h2>
                <P>${user.title}</P>
                <a href="mailto:${user.mail}">${user.mail}</a>
                <div class="btns"> <button class="btn-update-user">Update</button>
                 <button class="btn-delete-user">Delete</button></div>
            </article>
        `
    );
    // To do: Add event listeners
    document
      .querySelector("#users-grid article:last-child .btn-delete-user")
      .addEventListener("click", () => deleteUser(user.id));
    document
      .querySelector("#users-grid article:last-child .btn-update-user")
      .addEventListener("click", () => selectUser(user));
  }
}

// ============ CREATE ============ //
// Create (POST) user to Firebase (Database) using REST API
async function createUser(event) {
  event.preventDefault();
  console.log("opret bruger");
  const name = event.target.name.value;
  const title = event.target.title.value;
  const mail = event.target.mail.value;
  const image = event.target.image.value;

  // To do: add variables with reference to input fields (event.target.xxxx.value)

  // create a new user
  const newUser = { name, title, mail, image }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(newUser);
  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: userAsJson,
  });

  if (response.ok) {
    updateUsersGrid();
    scrollToTop();
    // if success, update the users grid
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    // To do: call scrollToTop to scroll when created
  }
}

// ============ UPDATE ============ //
function selectUser(user) {
  console.log("user");
  // Set global varaiable
  selectedUser = user;
  // reference to update form
  const form = document.querySelector("#form-update");

  // To do: set form input values with user.xxxx
  form.name.value = user.name;
  form.title.value = user.title;
  form.mail.value = user.mail;
  form.image.value = user.image;
  const x = document.getElementById("updateDialog").showModal();
  console.log("Test");

  form.scrollIntoView({ behavior: "smooth" });
}

async function updateUser(event) {
  event.preventDefault();

  // To do: add variables with reference to input fields (event.target.xxxx.value)
  const name = event.target.name.value;
  const title = event.target.title.value;
  const mail = event.target.mail.value;
  const image = event.target.image.value;
  // update user
  const userToUpdate = { name, title, mail, image }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(userToUpdate);
  const response = await fetch(`${endpoint}/users/${selectedUser.id}.json`, {
    method: "PUT",
    body: userAsJson,
  });
  if (response.ok) {
    // if success, update the users grid
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    updateUsersGrid();
    // To do: call scrollToTop to scroll when created
    scrollToTop();
    const x = document.getElementById("updateDialog").close();
  }
}

// ================== DELETE ============ //
async function deleteUser(id) {
  console.log("id");
  const response = await fetch(`${endpoint}/users/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // To do: make sure to update the users grid in order to display the new user
    scrollToTop();
  }
}

// ================== Events and Event Listeners ============ //
// To do: add submit event listener to create form (#form-create)
document.querySelector("#form-create").addEventListener("submit", createUser);
// To do: add submit event listener to update form (#form-update)

document.querySelector("#form-update").addEventListener("submit", updateUser);
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateUsersGrid() {
  const users = await readUsers();
  displayUsers(users);
}
updateUsersGrid();

// ============ Init CRUD App ============ //
// To do: call/ run updateUsersGrid to initialise the app
