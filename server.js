const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Database Initialization
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        // Create the users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            skills TEXT
        )`);
    }
});

// CREATE: POST route to add a new user from the frontend form
app.post('/api/users', (req, res) => {
    const { firstName, lastName, email, phone, skills } = req.body;

    if (!firstName || !lastName || !email) {
        // 400 Bad Request: Missing required fields
        return res.status(400).json({ error: "First name, last name, and email are required." });
    }

    const sql = 'INSERT INTO users (first_name, last_name, email, phone, skills) VALUES (?, ?, ?, ?, ?)';
    const params = [firstName, lastName, email, phone, skills];

    db.run(sql, params, function(err) {
        if (err) {
            // 400 Bad Request: Likely a unique constraint violation on the email
            return res.status(400).json({ error: err.message });
        }
        // 201 Created: Resource successfully added to the database
        res.status(201).json({
            message: "User created successfully",
            id: this.lastID
        });
    });
});

// READ: GET route to fetch all users
app.get('/api/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) {
            // 500 Internal Server Error: Database failure
            return res.status(500).json({ error: err.message });
        }
        // 200 OK: Data retrieved successfully
        res.status(200).json({ data: rows });
    });
});

// READ: GET route to fetch a specific user by ID
app.get('/api/users/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            // 404 Not Found: Requested resource does not exist
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ data: row });
    });
});

// UPDATE: PUT route to modify an existing user
app.put('/api/users/:id', (req, res) => {
    const { firstName, lastName, email, phone, skills } = req.body;
    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, skills = ? WHERE id = ?`;
    const params = [firstName, lastName, email, phone, skills, req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
    });
});

// DELETE: DELETE route to remove a user
app.delete('/api/users/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});