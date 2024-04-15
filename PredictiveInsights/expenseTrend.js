document.addEventListener('DOMContentLoaded', function () {
    const expenseTrendsBtn = document.getElementById('expenseTrendsBtn');
    const categorySpendingBtn = document.getElementById('categorySpendingBtn');
    const predictNextMonthBtn = document.getElementById('predictNextMonthBtn'); // New button
    const contentDiv = document.getElementById('content');
    const userId = sessionStorage.getItem('userId');
    let myChart; // Global variable to hold the Chart instance
    

    expenseTrendsBtn.addEventListener('click', async function () {
        try {
            const response = await fetch(`http://localhost:3000/expenseTrends?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch expense trends');
            }
            const expenseTrends = await response.json();
            displayExpenseTrends(expenseTrends);
        } catch (error) {
            console.error('Error fetching expense trends:', error.message);
        }
    }); 

    categorySpendingBtn.addEventListener('click', async function () {
        try {
            const response = await fetch(`http://localhost:3000/categorySpending?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch category-wise spending data');
            }
            const categorySpendingData = await response.json();
            displayCategorySpending(categorySpendingData);
        } catch (error) {
            console.error('Error fetching category-wise spending data:', error.message);
        }
    });

    function displayExpenseTrends(expenseTrends) {
        let html = '<h2>Expense Trends Analysis</h2>';
        html += '<ul>';
        expenseTrends.forEach(trend => {
            html += `<li>Month: ${trend.month}, Year: ${trend.year}, Total Amount: ${trend.totalAmount}</li>`;
        });
        html += '</ul>';
        contentDiv.innerHTML = html;

        // Extract data for the chart
        const months = expenseTrends.map(trend => `${trend.month}-${trend.year}`);
        const amounts = expenseTrends.map(trend => trend.totalAmount);

        // Check if a Chart instance already exists, and destroy it if it does
        if (myChart) {
            myChart.destroy();
        }

        // Create the bar chart
        const ctx = document.getElementById('barChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Amount',
                    data: amounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    function displayCategorySpending(categorySpendingData) {
        let html = '<h2>Category-wise Spending Analysis</h2>';
        html += '<ul>';
        categorySpendingData.forEach(category => {
            html += `<li>Category: ${category.expense_type}, Total Amount: ${category.totalAmount}</li>`;
        });
        html += '</ul>';
        contentDiv.innerHTML = html;

        const categories = categorySpendingData.map(category => category.expense_type);
        const amounts = categorySpendingData.map(category => category.totalAmount);

        // Check if a Chart instance already exists, and destroy it if it does
        if (myChart) {
            myChart.destroy();
        }

        // Create the bar chart
        const ctx = document.getElementById('barChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Amount',
                    data: amounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    predictNextMonthBtn.addEventListener('click', async function () {
        try {
            const response = await fetch(`http://localhost:5000/predict-next-month-expense?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to predict next month expenses');
            }
            const data = await response.json();
            const predictedExpense = data.predicted_expense;
            displayPredictedExpense(predictedExpense);
        } catch (error) {
            console.error('Error predicting next month expenses:', error.message);
        }
    });

    function displayPredictedExpense(predictedExpense) {
        let html = '<h2>Predicted Next Month Expenses</h2>';
        html += `<p>Predicted expense for the next month: $${predictedExpense.toFixed(2)}</p>`;
        contentDiv.innerHTML = html;
    }

});
