const express = require('express');
const router = express.Router();

module.exports = function(connection) {
    // API endpoint for viewing budget
    router.get('/viewbudget', (req, res) => {
        const { month, year, userId } = req.query;

        // Fetch budget details for the specified month, year, and userId
        connection.query('SELECT * FROM budget WHERE month = ? AND year = ? AND user_id = ?', [month, year, userId], (err, results) => {
            if (err) {
                console.error('Error fetching budget:', err);
                return res.status(500).json({ error: 'Error fetching budget' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Budget not found for the specified month, year, and user' });
            }
            res.status(200).json(results[0]); // Send the budget details as a JSON response
        });
    });

    // API endpoint for fetching progress details
    router.get('/progress', (req, res) => {
        const { month, year, userId } = req.query;

        // Fetch expenses for the specified month, year, and userId
        connection.query('SELECT expense_type, SUM(amount) AS totalAmount FROM expenses WHERE month(date) = ? AND year(date) = ? AND user_id = ? GROUP BY expense_type', [month, year, userId], (err, results) => {
            if (err) {
                console.error('Error fetching expenses:', err);
                return res.status(500).json({ error: 'Error fetching expenses' });
            }

            // Fetch budget details for the specified month, year, and userId
            connection.query('SELECT * FROM budget WHERE month = ? AND year = ? AND user_id = ?', [month, year, userId], (err, budgetResults) => {
                if (err) {
                    console.error('Error fetching budget:', err);
                    return res.status(500).json({ error: 'Error fetching budget' });
                }
                if (budgetResults.length === 0) {
                    return res.status(404).json({ error: 'Budget not found for the specified month, year, and user' });
                }

                const budget = budgetResults[0];
                const progress = {};

                // Calculate progress for each expense type
                results.forEach(expense => {
                    const expenseType = expense.expense_type;
                    const allocatedAmount = budget[`${expenseType.toLowerCase()}_allocation`];
                    const spentAmount = expense.totalAmount;
                    const progressPercent = (spentAmount / allocatedAmount) * 100;

                    progress[expenseType] = {
                        allocatedAmount: allocatedAmount,
                        spentAmount: spentAmount,
                        progressPercent: progressPercent.toFixed(2)
                    };
                });

                // Calculate the percentage of the overall budget spent
                const overallSpentAmount = Object.values(progress).reduce((acc, curr) => acc + curr.spentAmount, 0);
                const overallBudget = budget.overall_budget;
                const overallProgressPercent = (overallSpentAmount / overallBudget) * 100;

                // Include the percentage of the overall budget spent in the progress data
                progress['overall'] = {
                    allocatedAmount: overallBudget,
                    spentAmount: overallSpentAmount,
                    progressPercent: overallProgressPercent.toFixed(2)
                };


                res.status(200).json(progress); // Send the progress details as a JSON response
            });
        });
    });

    return router;
};
