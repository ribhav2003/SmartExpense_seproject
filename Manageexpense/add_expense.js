document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');

    expenseForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const expenseName = document.getElementById('expenseName').value;
        const expenseType = document.getElementById('expenseType').value;
        const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage

        try {
            const response = await fetch('http://localhost:3000/addexpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ expenseName, expenseType, userId }) // Include userId in the request body
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
