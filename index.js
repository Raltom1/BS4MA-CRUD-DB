const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();
const port = 3000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: '',  // Your MySQL password (if any)
  database: 'cruddb'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// CREATE (Insert a user)
app.post('/users', (req, res) => {
  const { firstName, lastName, idNumber } = req.body;
  const query = 'INSERT INTO users (firstName, lastName, idNumber) VALUES (?, ?, ?)';
  db.query(query, [firstName, lastName, idNumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding user');
    }
    res.status(201).send('User added successfully');
  });
});

// READ (Get all users)
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching users');
    }
    res.status(200).json(results);
  });
});

// UPDATE (Edit a user)
app.put('/users/:id', (req, res) => {
  const { firstName, lastName, idNumber } = req.body;
  const { id } = req.params;
  const query = 'UPDATE users SET firstName = ?, lastName = ?, idNumber = ? WHERE id = ?';
  db.query(query, [firstName, lastName, idNumber, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating user');
    }
    res.status(200).send('User updated successfully');
  });
});

// DELETE (Delete a user)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting user');
    }
    res.status(200).send('User deleted successfully');
  });
});

// Serve the main HTML page at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
