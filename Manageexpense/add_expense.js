document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');

    expenseForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const expenseName = document.getElementById('expenseName').value;
        const expenseType = document.getElementById('expenseType').value;
        const amount = document.getElementById('amount').value;
        const userId = sessionStorage.getItem('userId');

        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().slice(0, 10);

        try {
            const response = await fetch('http://localhost:3000/addexpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ expenseName, expenseType, amount, userId, date: currentDate }) // Include date in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to add expense');
            }

            const result = await response.json();
            console.log('Expense added successfully:', result);
            // Optionally, you can display a success message to the user
        } catch (error) {
            console.error('Error adding expense:', error.message);
            // Optionally, you can display an error message to the user
        }
    });
});
