// Imports and setup for required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs'); // For password hashing
const bodyParser = require('body-parser');
const session = require('express-session');

// Initialize Express app
const app = express();

// Set up SQLite database
const db = new sqlite3.Database('./db.sqlite');

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(session({
    secret: 'secret-key', // Session secret key for signing session cookies
    resave: false,        // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session lasts for 24 hours
}));

// Serve static files from 'views' and 'public' directories
app.use(express.static('views'));  
app.use(express.static('public')); 

// Create 'users' table if it doesn't exist
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

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // If authenticated, proceed
    }
    res.redirect('/login.html'); // If not authenticated, redirect to login page
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.session.userId && req.session.username === 'admin') {
        return next(); // If admin, proceed
    }
    console.log('Access Denied: Not Admin');
    res.redirect('/login.html'); // If not admin, redirect to login page
}

// Routes

// Home route (redirect to login)
app.get('/', (req, res) => {
    res.redirect('/login.html'); // Redirect to login page
});

// Admin route (protected)
app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(__dirname + '/views/admin.html'); // Serve admin page
});

// API route to fetch user data (protected)
app.get('/admin/users', isAuthenticated, isAdmin, (req, res) => {
    db.all('SELECT username, email FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Server error');
        }
        res.json(rows); // Send user data as JSON
    });
});

// Register route
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
        if (row) {
            return res.redirect('/register.html?error=User already exists!');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [username, hashedPassword, email], (err) => {
            if (err) {
                return res.redirect('/register.html?error=Error registering user!');
            }

            // Redirect to login page after successful registration
            res.redirect('/login.html?success=Registration successful! You can now log in.');
        });
    });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (!row) {
            return res.redirect('/login.html?error=User not found!');
        }

        // Compare entered password with stored hashed password
        const isValid = await bcrypt.compare(password, row.password);
        if (!isValid) {
            return res.redirect('/login.html?error=Incorrect password!');
        }

        // Set session for authenticated user
        req.session.userId = row.id;
        req.session.username = row.username;

        // Redirect to admin or main page based on user role
        if (req.session.username === 'admin') {
            res.redirect('/admin'); // Admin redirect
        } else {
            res.redirect('/main'); // Non-admin redirect
        }
    });
});

// Protected main page route
app.get('/main', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/main.html'); // Serve the main page
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/login.html'); // Redirect to login after logout
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
