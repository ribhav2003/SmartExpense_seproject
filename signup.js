document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const responseData = await response.json();
            console.log('User signed up successfully:', responseData);
            // Optionally, you can redirect the user to another page or show a success message
        } catch (error) {
            console.error('Error signing up user:', error.message);
            // Optionally, you can display an error message to the user
        }
    });
});
