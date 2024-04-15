const express = require('express');
const router = express.Router();

module.exports = function(connection) {

    router.get('/expenseTrends', (req, res) => {
        const { userId } = req.query;

        // Fetch expense trends data from the database
        connection.query('SELECT MONTH(date) AS month, YEAR(date) AS year, SUM(amount) AS totalAmount FROM expenses WHERE user_id = ? GROUP BY YEAR(date), MONTH(date)', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching expense trends:', err);
                return res.status(500).json({ error: 'Error fetching expense trends' });
            }
            
            res.status(200).json(results); // Send the expense trends as a JSON response
        });
    });

    router.get('/categorySpending', (req, res) => {
        const { userId } = req.query;

        // Fetch category-wise spending data from the database
        connection.query('SELECT expense_type, SUM(amount) AS totalAmount FROM expenses WHERE user_id = ? GROUP BY expense_type', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching category-wise spending:', err);
                return res.status(500).json({ error: 'Error fetching category-wise spending' });
            }
            
            res.status(200).json(results); // Send the category-wise spending data as a JSON response
        });
    });

    // Add more API endpoints for other features here

    return router;
};
