window.onload = () => {
    const navbar = document.getElementById('navbar');
    const content = document.getElementById('content');

    navbar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            navigate(e.target.getAttribute('href').substring(1));
        }
    });

    const routes = {
        home: `<section id="home"><h2>Home</h2><p>Welcome to your dashboard. This is the home section.</p></section>`,
        profile: `<section id="profile"><h2>Profile</h2><p>Manage your profile information here.</p></section>`,
        settings: `<section id="settings"><h2>Settings</h2><p>Configure your preferences here.</p></section>`
    };

    function navigate(path) {
        content.innerHTML = routes[path] || `<section><h2>404 Not Found</h2><p>The requested section does not exist.</p></section>`;
    }

    // Check if the user is authenticated
    if (!localStorage.getItem('authToken')) {
        window.location.href = '../index.html'; // Redirect to login page if not authenticated
    }
};
