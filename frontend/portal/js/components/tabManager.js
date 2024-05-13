class TabManager {
    constructor(store, apiService) {
        this.store = store;
        this.apiService = apiService;
        this.tabContainer = document.querySelector('.tab-links');
        this.contentArea = document.querySelector('.tab-content');
        console.log('TabManager initialized');
    }

    setupTabs() {
        console.log('Setting up tabs');
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

        this.tabs = rolesToTabs[this.userRole] || [];
        this.initTabs();
    }

    initTabs() {
        console.log('Initializing tabs');
        this.tabContainer.innerHTML = '';
        this.contentArea.innerHTML = '';
        this.tabs.forEach(tab => {
            const tabLink = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${tab.id}`;
            link.textContent = tab.title;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadTabContent(tab.id);
            });

            tabLink.appendChild(link);
            this.tabContainer.appendChild(tabLink);

            const tabContent = document.createElement('div');
            tabContent.id = tab.id;
            tabContent.className = 'tab';
            tabContent.innerHTML = `<div class="content-area">Content for ${tab.title} will go here.</div>`;
            this.contentArea.appendChild(tabContent);
        });
    }

    loadTabContent(tabId) {
        console.log('Loading tab content for:', tabId);
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-links a').forEach(link => link.classList.remove('active'));

        const activeTab = document.querySelector(`#${tabId}`);
        const activeLink = document.querySelector(`a[href='#${tabId}']`);
        if (activeTab && activeLink) {
            activeTab.classList.add('active');
            activeLink.classList.add('active');
        }
    }
}

export default TabManager;
