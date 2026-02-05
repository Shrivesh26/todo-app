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
    showSuccessMessage("Logged In", "Successfully", 2000, "home.html");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    const msg = error?.response?.data?.message || error.message || "Login failed";
    showUnsuccessMessage("Login failed", msg, 2000);
  }
}



// // ====================================================================================
// // Elements
// const otpBtn = document.querySelector("#otpBtn");
// const emailInput = document.querySelector("#emailInput");
// const otpSection = document.querySelector("#otpSection");
// const resendBtn = document.querySelector("#resendBtn");
// const timerEl = document.querySelector("#timer");
// const verifyBtn = document.querySelector("#verifyBtn");

// // OTP input (inside otpSection)
// const otpInput = otpSection?.querySelector("input");

// let timerInterval;
// let timeLeft = 60;

// /* =========================
//    SEND OTP
// ========================= */
// if (otpBtn) {
//   otpBtn.addEventListener("click", async (e) => {
//     e.preventDefault();

//     const email = emailInput.value.trim();
//     if (!email) return alert("Email is required");

//     try {
//       const { data } = await axios.post(`http://localhost:4001/user/forgot`, { email });

//       alert(data.message);

//       // Show OTP section
//       otpSection.classList.remove("hidden");

//       otpBtn.classList.add("hidden");
//       verifyBtn.classList.remove("hidden");      

//       startTimer();

//       // Switch button behavior to verify OTP
//       verifyBtn.onclick = verifyOTP;

//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send OTP");
//     }
//   });
// }

// /* =========================
//    VERIFY OTP
// ========================= */
// async function verifyOTP(e) {
//   e.preventDefault();

//   const email = emailInput.value.trim();
//   const otp = otpInput.value.trim();

//   if (!otp || otp.length !== 6) {
//     return alert("Enter a valid 6-digit OTP");
//   }

//   try {
//     const { data } = await axios.post(`http://localhost:4001/user/verify-otp`, {
//       email,
//       otp: otp.toString() // 🔴 IMPORTANT
//     });

//     alert(data.message);

//     // 👉 redirect later
//     localStorage.setItem("resetEmail",email);
//     window.location.href = "reset-password.html";

//   } catch (err) {
//     alert(err.response?.data?.message || "OTP verification failed");
//   }
// }

// /* =========================
//    RESEND OTP
// ========================= */
// async function resendOTP() {
//   const email = emailInput.value.trim();
//   if (!email) return alert("Email required");

//   try {
//     const { data } = await axios.post(`http://localhost:4001/user/forgot`, { email });

//     alert("OTP resent successfully");
//     startTimer();
//   } catch (err) {
//     alert(err.response?.data?.message || "Failed to resend OTP");
//   }
// }

// // Make resendOTP global (because HTML uses onclick)
// window.resendOTP = resendOTP;

// /* =========================
//    TIMER LOGIC
// ========================= */
// function startTimer() {
//   clearInterval(timerInterval);
//   timeLeft = 60;

//   resendBtn.disabled = true;
//   resendBtn.classList.add("cursor-not-allowed");
//   timerEl.textContent = timeLeft;

//   timerInterval = setInterval(() => {
//     timeLeft--;
//     timerEl.textContent = timeLeft;

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       resendBtn.disabled = false;
//       resendBtn.classList.remove("cursor-not-allowed");
//       timerEl.textContent = "0";
//     }
//   }, 1000);
// }


// // ====================================================================================
// const resetBtn = document.querySelector("#resetBtn");
// const newPassword = document.querySelector("#newPassword");
// const confirmPassword = document.querySelector("#confirmPassword");

// // ✅ Run ONLY if reset-password page elements exist
// if (resetBtn && newPassword && confirmPassword) {

//   const email = localStorage.getItem("resetEmail");

//   // 🔒 Protect reset page access
//   if (!email) {
//     alert("Invalid access. Please verify OTP again.");
//     window.location.href = "forgot.html";
//     return; // ⛔ stop further execution
//   }

//   resetBtn.addEventListener("click", async (e) => {
//     e.preventDefault();

//     const password = newPassword.value.trim();
//     const confirm = confirmPassword.value.trim();

//     if (!password || !confirm)
//       return alert("All fields are required");

//     if (password.length < 6)
//       return alert("Password must be at least 6 characters");

//     if (password !== confirm)
//       return alert("Passwords do not match");

//     try {
//       const { data } = await axios.post(
//         "http://localhost:4001/user/reset-password",
//         { email, password }
//       );

//       alert(data.message);

//       localStorage.removeItem("resetEmail");
//       window.location.href = "index.html";

//     } catch (err) {
//       alert(err.response?.data?.message || "Password reset failed");
//     }
//   });
// }




// ====================================================================================
// OTP + RESET PASSWORD (PURE VANILLA JS — SAFE SINGLE FILE)
// ====================================================================================

// ======================
// OTP PAGE ELEMENTS
// ======================
const otpBtn = document.querySelector("#otpBtn");
const emailInput = document.querySelector("#emailInput");
const otpSection = document.querySelector("#otpSection");
const resendBtn = document.querySelector("#resendBtn");
const timerEl = document.querySelector("#timer");
const verifyBtn = document.querySelector("#verifyBtn");
const otpInput = otpSection ? otpSection.querySelector("input") : null;

let timerInterval;
let timeLeft = 60;

// ======================
// SEND OTP
// ======================
if (otpBtn && emailInput && otpSection && verifyBtn) {

  otpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return alert("Email is required");

    try {
      const { data } = await axios.post(
        "http://localhost:4001/user/forgot",
        { email }
      );

      alert(data.message);

      otpSection.classList.remove("hidden");
      otpBtn.classList.add("hidden");
      verifyBtn.classList.remove("hidden");

      startTimer();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  });

  verifyBtn.addEventListener("click", verifyOTP);
}

// ======================
// VERIFY OTP
// ======================
async function verifyOTP(e) {
  e.preventDefault();

  if (!otpInput || !emailInput) return;

  const email = emailInput.value.trim();
  const otp = otpInput.value.trim();

  if (!otp || otp.length !== 6) {
    return alert("Enter a valid 6-digit OTP");
  }

  try {
    const { data } = await axios.post(
      "http://localhost:4001/user/verify-otp",
      { email, otp }
    );

    alert(data.message);

    localStorage.setItem("resetEmail", email);
    window.location.href = "reset-password.html";

  } catch (err) {
    alert(err.response?.data?.message || "OTP verification failed");
  }
}

// ======================
// RESEND OTP
// ======================
if (resendBtn && emailInput) {
  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return alert("Email is required");

    try {
      const { data } = await axios.post(
        "http://localhost:4001/user/forgot",
        { email }
      );

      alert(data.message || "OTP resent");
      startTimer();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  });
}

// ======================
// TIMER LOGIC
// ======================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;

  if (resendBtn) {
    resendBtn.disabled = true;
    resendBtn.classList.add("cursor-not-allowed");
  }

  if (timerEl) timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timerEl) timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.classList.remove("cursor-not-allowed");
      }

      if (timerEl) timerEl.textContent = "0";
    }
  }, 1000);
}


// ====================================================================================
// RESET PASSWORD PAGE (FORM-BASED — NO REFRESH)
// ====================================================================================
const resetForm = document.querySelector("#resetForm");
const resetBtn = document.querySelector("#resetBtn");
const newPassword = document.querySelector("#newPassword");
const confirmPassword = document.querySelector("#confirmPassword");

// ✅ Run ONLY on reset-password page
if (resetForm && resetBtn && newPassword && confirmPassword) {

  const email = localStorage.getItem("resetEmail");

  // 🔒 Prevent direct access
  if (!email) {
    alert("Invalid access. Please verify OTP again.");
    window.location.href = "forgot.html";
  }

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // ⛔ stop page refresh

    const password = newPassword.value.trim();
    const confirm = confirmPassword.value.trim();

    if (!password || !confirm)
      return alert("All fields are required");

    if (password.length < 6)
      return alert("Password must be at least 6 characters");

    if (password !== confirm)
      return alert("Passwords do not match");

    try {
      const { data } = await axios.post(
        "http://localhost:4001/user/reset-password",
        { email, newPassword: password }
      );

      alert(data.message);

      localStorage.removeItem("resetEmail");
      window.location.href = "index.html";

    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  });
}