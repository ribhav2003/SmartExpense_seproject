const express = require('express');
const router = express.Router();

module.exports = function(connection) {
    // API endpoint for adding an expense
    router.post('/addexpense', (req, res) => {
        const { expenseName, expenseType, userId } = req.body;

        // Check if the expenses table exists, if not create it
        connection.query('CREATE TABLE IF NOT EXISTS expenses (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, expense_name VARCHAR(255), expense_type VARCHAR(255))', (err, result) => {
            if (err) {
                console.error('Error creating expenses table:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Insert the expense into the expenses table
            connection.query('INSERT INTO expenses (user_id, expense_name, expense_type) VALUES (?, ?, ?)', [userId, expenseName, expenseType], (err, result) => {
                if (err) {
                    console.error('Error adding expense:', err);
                    return res.status(500).json({ error: 'Error adding expense' });
                }
                console.log('Expense added successfully');
                res.status(200).json({ message: 'Expense added successfully' });
            });
        });
    });

    return router;
};
