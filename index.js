const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// ✅ Serve static files from the root directory (where index.html, main.js, style.css are)
app.use(express.static(__dirname));

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cruddb'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// API Routes (same as before)
app.post('/users', (req, res) => {
  const { firstName, lastName, idNumber } = req.body;
  const sql = 'INSERT INTO users (firstName, lastName, idNumber) VALUES (?, ?, ?)';
  db.query(sql, [firstName, lastName, idNumber], (err, result) => {
    if (err) return res.status(500).send('Insert failed');
    res.status(201).send('User added');
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('Fetch failed');
    res.json(results);
  });
});

app.delete('/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send('Delete failed');
    res.send('User deleted');
  });
});

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
