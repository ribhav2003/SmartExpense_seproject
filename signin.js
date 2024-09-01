document.addEventListener('DOMContentLoaded', function () {
    const signinForm = document.getElementById('signinForm');

    signinForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to sign in');
            }

            const userData = await response.json();
            console.log('User signed in successfully:', userData);
            
            // Store user session
            sessionStorage.setItem('userId', userData.id);
            sessionStorage.setItem('userName', userData.name);
            sessionStorage.setItem('userEmail', userData.email);

            // Redirect to home.html
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error signing in:', error.message);
            // Optionally, you can display an error message to the user
        }
    });
});
