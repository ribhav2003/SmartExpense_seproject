document.addEventListener('DOMContentLoaded', function () {
    const viewBudgetForm = document.getElementById('viewBudgetForm');
    const budgetDetails = document.getElementById('budgetDetails');
    const progressDetails = document.getElementById('progressDetails');
    const userId = sessionStorage.getItem('userId');

    viewBudgetForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;

        try {
            const response = await fetch(`http://localhost:3000/viewbudget?month=${month}&year=${year}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch budget details');
            }
            const budget = await response.json();
            displayBudgetDetails(budget, month, year);
        } catch (error) {
            console.error('Error fetching budget details:', error.message);
        }
    });

    const showProgressBtn = document.getElementById('showProgressBtn');
    showProgressBtn.addEventListener('click', async function () {
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;

        try {
            const response = await fetch(`http://localhost:3000/progress?month=${month}&year=${year}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch progress details');
            }
            const progress = await response.json();
            displayProgressDetails(progress);
        } catch (error) {
            console.error('Error fetching progress details:', error.message);
        }
    });

    function displayBudgetDetails(budget, month, year) {
        budgetDetails.innerHTML = `<h2>Budget Details</h2>
                                    <p>Month: ${month}</p>
                                    <p>Year: ${year}</p>
                                    <p>Overall Budget: ${budget.overall_budget}</p>
                                    <p>Daily Needs Allocation: ${budget.daily_needs_allocation}</p>
                                    <p>Friends and Family Allocation: ${budget.friends_and_family_allocation}</p>
                                    <p>Bills Allocation: ${budget.bills_allocation}</p>
                                    <p>Eatables Allocation: ${budget.eatables_allocation}</p>
                                    <p>Miscellaneous Allocation: ${budget.miscellaneous_allocation}</p>`;
    }

    function displayProgressDetails(progress) {
        progressDetails.innerHTML = `<h2>Percent of allocated Budget spent already</h2>
                                      <p>Daily Needs: ${progress.daily_needs.progressPercent}%</p>
                                      <p>Friends and Family: ${progress.friends_and_family.progressPercent}%</p>
                                      <p>Bills: ${progress.bills.progressPercent}%</p>
                                      <p>Eatables: ${progress.eatables.progressPercent}%</p>
                                      <p>Miscellaneous: ${progress.miscellaneous.progressPercent}%</p>
                                      <p>Overall: ${progress.overall.progressPercent}% of Overall Budget spent</p>`;
    }
});
