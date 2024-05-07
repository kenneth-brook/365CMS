document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('.login-button');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    loginButton.addEventListener('click', function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('authToken', data.token); // Store the token in local storage
            window.location.href = './portal/index.html'; // Redirect to the SPA
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.error-message').innerHTML = 'Login Failed: ' + error.message;
        });
    });
});
