import { createBusinessToolbar, createEventsToolbar, createOfficeContentToolbar } from './common/toolbars.js';

class TabManager {
    constructor(store, apiService, router) {
        this.store = store;
        this.apiService = apiService;
        this.router = router;
        this.tabContainer = document.querySelector('.tab-links');
        this.contentArea = document.querySelector('.tab-content');
        this.setupTabs();
    }

    setupTabs() {
        console.log('Setting up tabs');
        const rolesToTabs = {
            "365admin": [
                { id: 'businesses', title: 'Businesses', toolbar: createBusinessToolbar },
                { id: 'events', title: 'Events', toolbar: createEventsToolbar },
                { id: 'office-content', title: 'Office Content', toolbar: createOfficeContentToolbar }
            ],
            admin: [
                { id: 'businesses', title: 'Businesses', toolbar: createBusinessToolbar },
                { id: 'events', title: 'Events', toolbar: createEventsToolbar },
                { id: 'office-content', title: 'Office Content', toolbar: createOfficeContentToolbar }
            ],
            user: [
                { id: 'businesses', title: 'Businesses', toolbar: createBusinessToolbar },
                { id: 'events', title: 'Events', toolbar: createEventsToolbar }
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
                this.router.navigate(tab.id);
            });
    
            tabLink.appendChild(link);
            this.tabContainer.appendChild(tabLink);
    
            const tabContent = document.createElement('div');
            tabContent.id = tab.id;
            tabContent.className = 'tab';
    
            // Append the toolbar first
            const toolbar = tab.toolbar();
            tabContent.appendChild(toolbar);
    
            // Then create and append the content area
            const contentArea = document.createElement('div');
            contentArea.className = 'content-area';
            contentArea.innerHTML = `Content for ${tab.title} will go here.`;
            tabContent.appendChild(contentArea);
    
            this.contentArea.appendChild(tabContent);
            this.router.addRoute(tab.id, () => this.loadTabContent(tab.id));
        });
    
        if (window.location.hash) {
            this.router.loadCurrentRoute();
        } else if (this.tabs.length > 0) {
            this.router.navigate(this.tabs[0].id);
        }
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
