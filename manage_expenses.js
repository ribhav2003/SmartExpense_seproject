document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId'); // Retrieve the user ID from session storage
    console.log('User ID:', userId);

    // Fetch previous expenses data for the user ID
    fetchPreviousExpenses(userId)
        .then(expenses => {
            // Render the previous expenses on the HTML page
            renderPreviousExpenses(expenses);
        })
        .catch(error => {
            console.error('Error fetching previous expenses:', error);
        });
});

// Function to fetch previous expenses data from the server
async function fetchPreviousExpenses(userId) {
    try {
        const response = await fetch(`/api/expenses?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch previous expenses data');
        }
        const expenses = await response.json();
        return expenses;
    } catch (error) {
        throw error;
    }
}

// Function to render previous expenses on the HTML page
function renderPreviousExpenses(expenses) {
    const previousExpensesList = document.getElementById('previous-expenses-list');
    previousExpensesList.innerHTML = ''; // Clear previous content

    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.expenseName}: ${expense.amount}`;
        previousExpensesList.appendChild(listItem);
    });
}
