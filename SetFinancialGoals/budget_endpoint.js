const express = require('express');
const router = express.Router();

module.exports = function(connection) {
    // API endpoint for setting budget
    router.post('/setbudget', (req, res) => {
        const { month, year, overallBudget, dailyNeeds, friendsFamily, bills, eatables, miscellaneous, userId } = req.body;

        // Check if the budget table exists, if not create it
        connection.query(`
            CREATE TABLE IF NOT EXISTS budget (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                month INT NOT NULL,
                year INT NOT NULL,
                overall_budget DECIMAL(10, 2) NOT NULL,
                daily_needs_allocation DECIMAL(10, 2) NOT NULL,
                friends_and_family_allocation DECIMAL(10, 2) NOT NULL,
                bills_allocation DECIMAL(10, 2) NOT NULL,
                eatables_allocation DECIMAL(10, 2) NOT NULL,
                miscellaneous_allocation DECIMAL(10, 2) NOT NULL,
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `, (err, result) => {
            if (err) {
                console.error('Error creating budget table:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Insert the budget into the budget table
            connection.query(`
                INSERT INTO budget (user_id, month, year, overall_budget, daily_needs_allocation, friends_and_family_allocation, bills_allocation, eatables_allocation, miscellaneous_allocation)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [userId, month, year, overallBudget, dailyNeeds, friendsFamily, bills, eatables, miscellaneous], (err, result) => {
                if (err) {
                    console.error('Error setting budget:', err);
                    return res.status(500).json({ error: 'Error setting budget' });
                }
                console.log('Budget set successfully');
                res.status(200).json({ message: 'Budget set successfully' });
            });
        });
    });

    return router;
};
