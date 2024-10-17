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
app.use(express.static('views'));  // This serves files in the 'views' foder
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

function isAdmin(req, res, next) {
    if(req.session.userId && req.session.username === 'admin') {
        next(); // proceed to the next middleware
    }
    else {
        console.log('Access Denied: Not Admin');
        res.redirect('/login.html');
    }
}

app.get('/admin', isAuthentificated, isAdmin, (req, res) => {
    res.sendFile(__dirname + '/views/admin.html');
});

app.get('/admin/users', isAuthentificated, isAdmin, (req, res) => {
    db.all('SELECT username, email FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Server error');
        }
        res.json(rows); // Send the user data as JSON
    });
});

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
        req.session.username = row.username

        // Redirect to the main page or admin page based on username
        if (req.session.username === 'admin') {
            res.redirect('/admin'); // Redirect to admin page
        } else {
            res.redirect('/main'); // Redirect to main page for non-admin users
        }
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

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // session lasts for 24 hours
    }
}));
