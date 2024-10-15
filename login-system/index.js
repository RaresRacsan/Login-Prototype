// Imports
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Create table users if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    } else {
        console.log("Users table created successfully.");
    }
});

// Serve static files
app.use(express.static('views'));
app.use(express.static('public')); // This serves files in the 'public' folder


// Authentification middleware
function isAuthentificated(req, res, next) {
    if (req.session.userId) {
        next(); // if the user is authentificated, proceed to the next middleware
    }
    else {
        res.redirect('/login.html');    // if not, redirect to login page
    }
}

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Register route
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if it already exists
    db.get('select * from users where username = ? OR email = ?', [username, email], async (err, row) => {
        if (row) return res.redirect('/register.html?error=User already exists!');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        db.run(`insert into users (username, password, email) values (?, ?, ?)`, [username, hashedPassword, email], (err) => {
            if (err) return res.redirect('/register.html?error=Error registering user!');

            // Redirect to login page after succesful registration
            res.redirect('/login.html?success=Registration successful! You can now log in.')
        });
    });
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (!row) {
            return res.redirect('/login.html?error=User not found!');
        }

        // Hash the entered password just to see how it looks
        const hashedEnteredPassword = await bcrypt.hash(password, 10);

        // Compare the plain entered password with the stored hashed password
        const isValid = await bcrypt.compare(password, row.password);
        if (!isValid) {
            return res.redirect('/login.html?error=Incorrect password!');
        }

        // Set session and login
        req.session.userId = row.id;
        res.redirect('/main'); // Redirect to the main page after successful login
    });
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html'); // Redirect to login page after logout
});

// Main Page Route (Protected)
app.get('/main', isAuthentificated, (req, res) => {
    res.sendFile(__dirname + '/views/main.html'); // Serve the main page only to authenticated users
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});