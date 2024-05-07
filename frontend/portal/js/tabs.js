document.addEventListener('DOMContentLoaded', function () {
    // Simulate user roles received after login
    //const userRole = localStorage.getItem('userRole'); // Assume 'admin', 'user', etc.
    const userRole = '365admin'

    // Define available tabs per role
    const rolesToTabs = {
        "365admin": [
            { id: 'businesses', title: 'Businesses' },
            { id: 'events', title: 'Events' },
            { id: 'office-content', title: 'Office Content' }
        ],
        admin: [
            { id: 'businesses', title: 'Businesses' },
            { id: 'events', title: 'Events' },
            { id: 'office-content', title: 'Office Content' }
        ],
        user: [
            { id: 'events', title: 'Events' }
        ]
    };

    const tabs = rolesToTabs[userRole] || [];
    const tabLinksContainer = document.querySelector('.tab-links');
    const tabContentContainer = document.querySelector('.tab-content');

    // Generate tabs dynamically
    tabs.forEach(tab => {
        const tabLink = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${tab.id}`;
        link.textContent = tab.title;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-links a').forEach(a => a.classList.remove('active'));

            document.querySelector(this.getAttribute('href')).classList.add('active');
            this.classList.add('active');
        });

        tabLink.appendChild(link);
        tabLinksContainer.appendChild(tabLink);

        const tabContent = document.createElement('div');
        tabContent.id = tab.id;
        tabContent.className = 'tab';
        tabContent.textContent = `Content for ${tab.title} will go here.`;
        tabContentContainer.appendChild(tabContent);
    });

    // Activate the first tab by default if it exists
    if (tabs.length > 0) {
        tabLinksContainer.children[0].children[0].classList.add('active');
        tabContentContainer.children[0].classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab-links a');
    let zIndex = 10; // Start from z-index 10
    tabs.forEach(tab => {
        tab.style.zIndex = zIndex--;
    });
});