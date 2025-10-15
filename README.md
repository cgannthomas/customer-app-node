# 🧾 Customer Management App

A simple **Customer Management System** built using **Node.js**, **Express**, and **EJS**.  
It allows users to **create**, **update**, **view**, and **delete** customers efficiently with a clean UI.

---

## 🚀 Features

- ➕ Create new customers  
- ✏️ Edit existing customer details  
- 🗑️ Delete customers  
- 👀 View all customers  using datatable
- ✅ Client-side validation (alphanumeric, required fields)  
- 🎨 Dynamic EJS views with reusable layouts  
- 📦 RESTful API structure for scalability  

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Backend | Node.js, Express.js |
| Frontend | EJS, HTML, CSS, JS, jQuery |
| Database | MongoDB |
| Version Control | Git & GitHub |

---

## 📁 Folder Structure
```bash
customer-app/
├── controllers/ 
│ ├── customerController.js
├── models/ 
│ ├── Customer.js
├── public/ # Static files (CSS, JS)
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── create.js
│ │ └── main.js
├── routes/ # Route definitions
│ └── customerRoutes.js
├── views/ # EJS templates
│ ├── layouts/
│ │ └── layout.ejs
│ ├── create-or-edit.ejs
│ ├── index.ejs
├── server.js # Main application file
├── package.json
├── .env
└── README.md


---
## ⚙️ Installation & Setup

1. **Clone the repository**
     ```bash
     git clone https://github.com/yourusername/customer-app.git
     cd customer-app
2. **Install dependencies**
   ```bash
    npm install
3. **Update env data as per your needs**
    ```bash
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/customer-app
4. **Run the app**
    ```bash
    npm start / npm run dev (or for development with auto-reload)
5. **Visit the app**
    ```bash
    http://localhost:5000

