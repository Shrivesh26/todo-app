// ==========================
// SAFE ELEMENT SELECTION
// ==========================
const ul = document.getElementById("todos");
const statusText = document.getElementById("statusText");
const todoInput = document.getElementById("inpTodo");
const addBtn = document.getElementById("addTodo");
const logoutBtn = document.getElementById("logout");

// remainingText depends on ul → guard it
const remainingText = ul ? ul.nextElementSibling : null;

// ==========================
// FETCH TODOS
// ==========================
async function getTodos() {
  if (!ul || !statusText) return; // ⛔ prevent signup crash

  try {
    statusText.textContent = "Loading...";
    statusText.style.display = "block";
    ul.innerHTML = "";

    const res = await axios.get("http://localhost:4001/todo/fetch", {
      withCredentials: true,
      headers: {
      "Content-Type": "application/json",
    }});

    const todos = res.data.todos || [];

    ul.innerHTML = "";

    if (todos.length > 0) {
      statusText.style.display = "none";
      todos.forEach(todo => {
        createList(todo.title, todo.completed, todo._id);
      });
    } else {
      statusText.textContent = "No todos yet";
      statusText.style.display = "block";
    }

    updateRemaining();
  } catch (err) {
    statusText.textContent = "Failed to load todos";
    statusText.style.color = "#ef4444";
    console.error(err);
  }
}

// ==========================
// CREATE TODO ITEM
// ==========================
function createList(msg, complete, _id) {
  if (!ul) return;

  const li = document.createElement("li");
  li.className = "flex justify-between items-center py-2 border-b w-full";

  const leftDiv = document.createElement("div");
  leftDiv.className = "flex items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = complete;

  const span = document.createElement("span");
  span.textContent = msg;

  if (complete) span.classList.add("strike");

  checkbox.addEventListener("change", () => {
    span.classList.toggle("strike", checkbox.checked);
    updateRemaining();
    updateTodo(_id, checkbox, span);
  });

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(span);

  const dltBtn = document.createElement("button");
  dltBtn.textContent = "Delete";
  dltBtn.className = "text-red-500";

  dltBtn.addEventListener("click", async () => {
    if (confirm("Do you want to delete the todo?")) {
      li.remove();
      await deleteTodo(_id);
      updateRemaining();

      if (ul.children.length === 0 && statusText) {
        statusText.textContent = "No todos yet";
        statusText.style.display = "block";
      }
    }
  });

  li.appendChild(leftDiv);
  li.appendChild(dltBtn);
  ul.appendChild(li);
}

// ==========================
// UPDATE REMAINING
// ==========================
function updateRemaining() {
  if (!ul || !remainingText) return;

  let remaining = 0;

  for (let item of ul.children) {
    const checkbox = item.querySelector("input");
    if (checkbox && !checkbox.checked) remaining++;
  }

  remainingText.textContent = `${remaining} todos remaining`;
}

// ==========================
// DELETE TODO
// ==========================
async function deleteTodo(id) {
  try {
    await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
      withCredentials: true
    });
  } catch (err) {
    console.error("Delete failed", err);
  }
}

// ==========================
// CREATE TODO
// ==========================
async function createTodo() {
  if (!todoInput) return;

  const value = todoInput.value.trim();
  if (!value) {
    alert("Please enter a todo");
    return;
  }

  try {
    await axios.post(
      "http://localhost:4001/todo/create",
      { title: value },
      { withCredentials: true }
    );

    todoInput.value = "";
    await getTodos();
  } catch (err) {
    console.error("Error creating todo", err);
  }
}

// ==========================
// UPDATE TODO
// ==========================
async function updateTodo(id, checkbox, span) {
  try {
    await axios.put(
      `http://localhost:4001/todo/update/${id}`,
      {
        title: span.textContent,
        completed: checkbox.checked
      },
      {
        withCredentials: true
      }
    );
  } catch (err) {
    console.error("Update failed", err);
  }
}

// ==========================
// EVENT LISTENERS (SAFE)
// ==========================
if (addBtn) {
  addBtn.addEventListener("click", createTodo);
}

if (todoInput) {
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createTodo();
    }
  });
}


// ==========================
// LOGOUT
// ==========================
if(logoutBtn){
  logoutBtn.addEventListener("click", async ()=>{
    await axios.get("http://localhost:4001/user/logout",{withCredentials:true});
    localStorage.removeItem("jwt");
    showSuccessMessage("Logged Out", "Successfully logged out", 1500, "index.html");
    setTimeout(()=>{ window.location.href = "index.html"; },1500);
  })
}


// ==========================
// INIT (ONLY IF TODO PAGE)
// ==========================
if (ul) {
  getTodos();
}






// ====================================================================================
let signUp = document.querySelector("#signup")
if(signUp){
  signUp.addEventListener("click", (e)=>{
    e.preventDefault();
    const usernameInput = document.querySelector("input[type='text']");
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }
    signup(username, email, password);

    username.value ="";
    email.value ="";
    password.value ="";
  });
}

async function signup(username, email, password) {
  try {
    const user = await axios.post("http://localhost:4001/user/register",{
      username, email, password
    }, {withCredentials : true} );
    // localStorage.setItem("jwt",user.data.token)

    if (user.status === 200 || user.data?.success) {
      showSuccessMessage("Registration Successful","Your account has been created successfully.",2500, "index.html");
    }
  } catch (error) {
    const firstError = error?.response?.data?.errors?.[0] || error?.response?.data?.message || error.message || "Something went wrong";
    console.error("Error on registering:", firstError);

    showUnsuccessMessage("Registration Unsuccessful", firstError, 2000);
  }
}

function showSuccessMessage(item, message, delay, redirect) {
  const div = document.createElement("div");
  div.className =
    "w-full max-w-md flex items-center gap-4 p-5 m-5 fixed bottom-0 right-0 " +
    "bg-green-50 border border-green-300 rounded-2xl shadow-lg";

  div.innerHTML = `
    <div class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
      <i class="fa-regular fa-circle-check text-2xl text-green-600"></i>
    </div>
    <div>
      <h2 class="text-lg font-semibold text-green-700">${item}</h2>
      <p class="text-sm text-green-600">${message}</p>
    </div>
  `;

  document.body.appendChild(div);
  setTimeout(()=>{
    div.remove();
    window.location.href = redirect;
  }, delay);
}

function showUnsuccessMessage(item, message, delay) {
  const div = document.createElement("div");
  div.className =
    "w-full max-w-md flex items-center gap-4 p-5 m-5 fixed bottom-0 right-0 " +
    "bg-red-50 border border-red-300 rounded-2xl shadow-lg";

  div.innerHTML = `
    <div class="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
      <i class="fa-regular fa-circle-xmark text-2xl text-red-600"></i>
    </div>
    <div>
      <h2 class="text-lg font-semibold text-red-700">${item}</h2>
      <p class="text-sm text-red-600">${message}</p>
    </div>
  `;

  document.body.appendChild(div);
  setTimeout(()=>{
    div.remove();
  }, delay);
}


// ====================================================================================
const loginBtn = document.querySelector("#login");
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let emailLogin = document.querySelector("input[type='email']").value.trim();
    let passwordLogin = document.querySelector("input[type='password']").value.trim();

    if (!emailLogin || !passwordLogin) {
      alert("All fields are required");
      return;
    }
    login(emailLogin, passwordLogin);

    emailLogin.value ="";
    passwordLogin.value ="";
  });
}

async function login(email, password) {
  try {
    const {data} = await axios.post(
      "http://localhost:4001/user/login",
      { email : email, password: password },
      { withCredentials: true }
    );
    console.log("frontend",data);
    localStorage.setItem("jwt",data.token)
    showSuccessMessage("Logged In", "Successfully", 2000, "home.html");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    const msg = error?.response?.data?.message || error.message || "Login failed";
    showUnsuccessMessage("Login failed", msg, 2000);
  }
}