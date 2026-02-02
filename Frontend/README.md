# Todo App – Frontend

This is the **frontend** of a Todo Application built using **HTML, Tailwind CSS (CLI), and JavaScript**.  
The frontend communicates with a backend API to handle authentication and todo operations.

Tailwind CSS is used via the **CLI approach**, not CDN.

---

## 📁 Frontend Folder Structure
Frontend/
├── src/
│ └── input.css
│ └──script.js
├── dist/
│ └── output.css (generated)
├── index.html
├── signup.html
├── home.html
├── pageNotFound.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
└── README.md


> ⚠️ `dist/output.css` is a **generated file** and is not committed to Git.

---

## 🎨 Tech Stack (Frontend)

- HTML5
- Tailwind CSS (CLI)
- JavaScript (Vanilla)
- PostCSS
- Live Server (VS Code)

---

## 📝 Todo App – Frontend Features

- User Login & Signup UI
- Create new todos
- View all todos
- Update todo status
- Delete todos
- Protected pages (based on auth state)
- Responsive UI using Tailwind
- API integration using Fetch / Axios

---

## 🛠️ Tailwind CSS Setup

This project uses **Tailwind CSS via CLI**, not CDN.

### 1️⃣ Required Configuration Files

#### tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

#### postcss.config.js

Required for Tailwind + PostCSS processing.

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}


### 2️⃣ Tailwind Input File

#### src/input.css

@tailwind base;
@tailwind components;
@tailwind utilities;



### 🚀 Running the Frontend

#### 1️⃣ Generate Tailwind CSS:

npx tailwindcss -i ./src/input.css -o ./dist/output.css


#### 2️⃣ Open index.html using Live Server