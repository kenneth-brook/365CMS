class TabManager {
    constructor(store, apiService) {
        this.store = store;
        this.apiService = apiService; // Add ApiService to the TabManager
        this.tabContainer = document.querySelector('.tab-links');
        this.contentArea = document.querySelector('.tab-content');

        console.log('TabManager initialized', this.tabContainer, this.contentArea);
        

        // Fetch user role from the server using ApiService
        this.fetchUserRole().then(role => {
            console.log('User role fetched:', role);
            this.userRole = role;
            this.setupTabs();
        }).catch(error => {
            console.error('Initialization error:', error);
            // Handle initialization errors, potentially redirect or show a message
        });
    }

    async fetchUserRole() {
        try {
            const data = await this.apiService.fetch('user-role');
            if (!data.role) {
                throw new Error('Role data is missing');
            }
            return data.role;
        } catch (error) {
            console.error('Error fetching user role:', error);
            window.location.href = '../'; // Redirect to login if not authenticated or other errors
            return null; // Return null or handle appropriately
        }
    }

    setupTabs() {
        this.tabs = {
            'Businesses': 'Content related to businesses will be displayed here.',
            'Events': 'Here you can view and manage upcoming events.',
        };

        // Only add Office Content tab for roles other than 'user'
        if (this.userRole !== 'user') {
            this.tabs['Office Content'] = 'Office related information and tools.';
        }

        console.log('Setting up tabs:', this.tabs);
        this.initTabs();
    }

    initTabs() {
        Object.keys(this.tabs).forEach(tab => {
            const tabElement = document.createElement('li');
            tabElement.textContent = tab;
            tabElement.addEventListener('click', () => this.loadTabContent(tab));
            this.tabContainer.appendChild(tabElement);
        });
        // Optionally, set the first tab as active by default
        this.loadTabContent(Object.keys(this.tabs)[0]);
    }

    loadTabContent(tab) {
        this.contentArea.innerHTML = this.tabs[tab];
        console.log('Tab content loaded:', tab);
    }
}

export default TabManager;
