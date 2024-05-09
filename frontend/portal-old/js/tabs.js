document.addEventListener('DOMContentLoaded', function () {
    setupTabs();
    window.addEventListener('popstate', handleLocation);
    handleLocation();  // Call on initial load to handle the current location
});

function setupTabs() {
    //const userRole = localStorage.getItem('userRole'); // Assume 'admin', 'user', etc.
    const userRole = '365admin'
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

    tabs.forEach(tab => {
        const tabLink = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${tab.id}`;
        link.textContent = tab.title;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-links a').forEach(a => a.classList.remove('active'));

            document.querySelector(link.getAttribute('href')).classList.add('active');
            link.classList.add('active');
        });

        tabLink.appendChild(link);
        tabLinksContainer.appendChild(tabLink);

        const tabContent = document.createElement('div');
        tabContent.id = tab.id;
        tabContent.className = 'tab';

        // Add specific toolbar based on the tab
        if (tab.id === 'businesses') {
            tabContent.appendChild(createBusinessToolbar());
        } else if (tab.id === 'events') {
            tabContent.appendChild(createEventsToolbar());
        } else if (tab.id === 'office-content') {
            tabContent.appendChild(createOfficeContentToolbar());
        }

        const contentArea = document.createElement('div');
        contentArea.className = 'content-area';
        contentArea.textContent = `Content for ${tab.title} will go here.`;
        tabContent.appendChild(contentArea);

        tabContentContainer.appendChild(tabContent);
    });

    if (tabs.length > 0) {
        tabLinksContainer.children[0].children[0].classList.add('active');
        tabContentContainer.children[0].classList.add('active');
    }

    const tabsLinks = document.querySelectorAll('.tab-links a');
    let zIndex = 10;
    tabsLinks.forEach(tab => {
        tab.style.zIndex = zIndex--;
    });
};

function handleLocation() {
    const path = window.location.hash.replace('#', '') || 'businesses'; // Default to 'businesses' if hash is empty
    navigateToTab(path);
}

function navigateToTab(tabId) {
    window.history.pushState({}, '', `#${tabId}`);
    activateTab(tabId);
}

function activateTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-links a').forEach(a => a.classList.remove('active'));
    document.querySelector('#' + tabId).classList.add('active');
    document.querySelector(`a[href='#${tabId}']`).classList.add('active');
}

window.addEventListener('popstate', () => {
    const tabId = window.location.hash.replace('#', '');
    if (tabId) {
        activateTab(tabId);
    }
});