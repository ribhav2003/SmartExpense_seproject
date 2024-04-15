const express = require('express');
const router = express.Router();

module.exports = function(connection) {
    // API endpoint for adding an expense
    router.post('/addexpense', (req, res) => {
        const { expenseName, expenseType, amount, userId } = req.body;
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

        // Check if the expenses table exists, if not create it
        connection.query('CREATE TABLE IF NOT EXISTS expenses (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, expense_name VARCHAR(255), expense_type VARCHAR(255), amount DECIMAL(10, 2), date DATE)', (err, result) => {
            if (err) {
                console.error('Error creating expenses table:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Insert the expense into the expenses table
            connection.query('INSERT INTO expenses (user_id, expense_name, expense_type, amount, date) VALUES (?, ?, ?, ?, ?)', [userId, expenseName, expenseType, amount, currentDate], (err, result) => {
                if (err) {
                    console.error('Error adding expense:', err);
                    return res.status(500).json({ error: 'Error adding expense' });
                }
                console.log('Expense added successfully');
                res.status(200).json({ message: 'Expense added successfully' });
            });
        });
    });

    // Define a new route to fetch expenses data for a specific user ID

router.get('/api/expenses', (req, res) => {
    const userId = req.query.userId;

    // Prepare the SQL query to fetch expenses data for the specified user ID
    const sql = 'SELECT * FROM expenses WHERE user_id = ?';

    // Execute the SQL query with the user ID as a parameter
    connection.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.status(500).json({ error: 'Error fetching expenses' });
        }
        console.log('Expenses fetched successfully');
        res.status(200).json(rows); // Send the fetched expenses data as a JSON response
    });
});


    

    return router;
};
