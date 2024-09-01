document.addEventListener('DOMContentLoaded', function () {
    const userId = sessionStorage.getItem('userId'); // Example user ID
    console.log('Fetching expenses for user ID:', userId);
    // Fetch expenses for the given user ID
    fetchExpenses(userId);

    function fetchExpenses(userId) {
        fetch(`http://localhost:3000/api/expenses/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                return response.json();
            })
            .then(data => {
                displayExpenses(data);
            })
            .catch(error => {
                console.error('Error fetching expenses:', error.message);
            });
    }

    function displayExpenses(expenses) {
        const expensesTable = document.getElementById('expenses-table');
        expensesTable.innerHTML = ''; // Clear previous entries
    
        // Create table header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>S.No</th><th>Date</th><th>Expense Name</th><th>Amount</th><th>Expense Type</th>';
        expensesTable.appendChild(headerRow);
    
        // Populate table with expenses data
        expenses.forEach((expense, index) => {
            // Extracting date part without the time
            const expenseDate = new Date(expense.date).toLocaleDateString('en-US');
    
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td>
                             <td>${expenseDate}</td>
                             <td>${expense.expense_name}</td>
                             <td>${expense.amount}</td>
                             <td>${expense.expense_type}</td>`;
            expensesTable.appendChild(row);
        });
    }
    
    }
);