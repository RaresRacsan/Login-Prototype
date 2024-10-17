# Login and Admin Dashboard System

A simple user authentication system built with Node.js, Express, and SQLite, featuring registration, login, and admin dashboard functionalities.

## Features
- **User Registration**: Users can register with a unique username, password, and email.
- **Login System**: Secure login system with password hashing (using bcrypt).
- **Admin Dashboard**: Only admins can view the list of registered users.
- **Session Management**: Session-based authentication for user and admin areas.

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Project Setup](#project-setup)
3. [Database Setup](#database-setup)
4. [How to Run](#how-to-run)
5. [Folder Structure](#folder-structure)

---

## Technologies Used

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building APIs and web apps.
- **SQLite**: Local database to store users' data.
- **bcrypt.js**: Password hashing library.
- **HTML, CSS, JavaScript**: For frontend and styling.
- **Session-based Authentication**: For managing user sessions.

---

## Project Setup

Follow the steps below to set up the project locally.

### Prerequisites
Before setting up the project, make sure you have the following installed:
- **Node.js** (v14 or later) - [Download Node.js](https://nodejs.org/en/)
- **npm** (comes with Node.js)
- **SQLite** - [Download SQLite](https://www.sqlite.org/download.html) (optional, as it will be generated by the app)

---

### Steps for Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/login-admin-dashboard.git
   cd login-admin-dashboard
   ```
2. **Install Dependencies**:
   This project uses npm for package management. To install the dependencies, run:
   ```bash
   npm install
   ```
   This will install the following dependencies:
   - express: A web framework for building APIs and web applications.
   - sqlite3: A lightweight, self-contained database engine.
   - bcryptjs: A library for hashing and comparing passwords.
   - express-session: Middleware for session management.
   After running npm install, it will automatically create a node_modules folder containing all these dependencies, so there's no need to include node_modules in your repository.
3. **Set up the Database**:
   The database (db.sqlite) will be created automatically when you run the app for the first time. However, if you need to set it up manually, you can do so by following these steps:
   - Ensure SQLite is installed on your machine.
   - The app uses an SQLite database, and the users table is created automatically. If you'd like to set up the database manually, you can run the following SQL query to create the table:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
   );
   ```
4. **Start the server**:
   To start the development server and run the app locally, run the following command:
   ```bash
   npm start
   ```
   This will start the server at http://localhost:3000.

---
   
## Database Setup

  The SQLite database (db.sqlite) is required for storing user data. It will be generated automatically when the app is run for the first time. You don’t need to manually create it unless    you want to.
  The database contains a users table, which holds the following columns:
  - id: A unique identifier for the user (auto-incremented).
  - username: The username chosen by the user (unique).
  - password: The hashed password for the user.
  - email: The user's email address (unique).

---

## How to Run

1. After cloning the repository, follow the Project Setup steps to install dependencies and set up the database.
2. To start the application, simply run:
  ```bash
  npm start
  ```
3. Open your browser and go to http://localhost:3000 to view the app.
  - You will first be redirected to the login page.
  - Use the admin credentials (admin/admin) to log in as the admin.
  - After logging in as a regular user, you will be redirected to the user dashboard.

---

## Folder Structure

Here's an overview of the project folder structure:
```bash
/login-admin-dashboard
  ├── /public
  │   ├── /css
  │   │   └── admin.css      # Styles for the admin page
  │   └── /js
  │       └── admin.js       # JavaScript for fetching and displaying users
  ├── /views
  │   ├── login.html         # Login page
  │   ├── register.html      # Registration page
  │   ├── main.html          # User dashboard
  │   └── admin.html         # Admin dashboard to view users
  ├── db.sqlite              # SQLite database (will be generated automatically)
  ├── index.js               # Main server file (Node.js app)
  ├── package.json           # npm dependencies and scripts
  └── package-lock.json      # Exact dependency versions
```

---

Let me know if you'd like any further adjustments or additions!
