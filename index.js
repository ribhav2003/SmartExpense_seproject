const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'users'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to MySQL server');

  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table: ', err);
            return;
        }
        console.log('Table created successfully');
    });

});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// API endpoint for user signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Insert user into database
  connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
    if (err) {
      console.error('Error signing up user: ', err);
      res.status(500).json({ error: 'Error signing up user' });
      return;
    }
    console.log('User signed up successfully');
    res.status(200).json({ message: 'User signed up successfully' });
  });
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
      if (err) {
          console.error('Error fetching users: ', err);
          res.status(500).json({ error: 'Error fetching users' });
          return;
      }
      res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
