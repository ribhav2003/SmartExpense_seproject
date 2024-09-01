const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Initialize session middleware
app.use(session({
    secret: 'secret', // Change this to a random string for better security
    resave: false,
    saveUninitialized: true
}));


const port = 3000;


// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tiger',
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

// Sign-in endpoint
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  // Query the database to check if the user exists
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
          console.error('Error querying database: ', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      // Check if user with provided email exists
      if (results.length === 0) {
          return res.status(401).json({ error: 'User not found' });
      }

      const user = results[0];

      // Check if the password matches
      if (user.password !== password) {
          return res.status(401).json({ error: 'Invalid password' });
      }

      // Authentication successful, return user data (you may want to omit the password here)
      res.json({ id: user.id, name: user.name, email: user.email });
  });
});

const add_expense_endpoint = require('./Manageexpense/add_expense_endpoint')(connection);
app.use(add_expense_endpoint);

const budget_endpoint = require('./SetFinancialGoals/budget_endpoint')(connection);
app.use(budget_endpoint);

const viewBudget_endpoint = require('./ViewBudget/viewBudget_endpoint')(connection);
app.use(viewBudget_endpoint);

const expenseTrend_endpoint= require('./PredictiveInsights/expenseTrend_endpoint.js')(connection);
app.use(expenseTrend_endpoint);

app.get('/api/expenses/:userId', (req, res) => {
  const userId = req.params.userId;
      const query = "SELECT * FROM expenses WHERE user_id = ?";
      connection.query(query, [userId], (err, results) => {
          if (err) {
              console.error('Error fetching expenses:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          res.status(200).json(results);
      });
  });





// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
