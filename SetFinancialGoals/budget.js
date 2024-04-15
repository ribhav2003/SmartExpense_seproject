document.addEventListener('DOMContentLoaded', function () {
    const budgetForm = document.getElementById('budgetForm');

    budgetForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const overallBudget = document.getElementById('overallBudget').value;
        const dailyNeeds = document.getElementById('dailyNeeds').value;
        const friendsFamily = document.getElementById('friendsFamily').value;
        const bills = document.getElementById('bills').value;
        const eatables = document.getElementById('eatables').value;
        const miscellaneous = document.getElementById('miscellaneous').value;
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await fetch('http://localhost:3000/setbudget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    month,
                    year,
                    overallBudget,
                    dailyNeeds,
                    friendsFamily,
                    bills,
                    eatables,
                    miscellaneous,
                    userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to set budget');
            }

            const result = await response.json();
            console.log('Budget set successfully:', result);
            // Optionally, you can display a success message to the user
        } catch (error) {
            console.error('Error setting budget:', error.message);
            // Optionally, you can display an error message to the user
        }
    });

    const showProgressBtn = document.getElementById('showProgressBtn');
    showProgressBtn.addEventListener('click', async function () {
        // Code to fetch and display progress
    });
});
