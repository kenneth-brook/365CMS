class TabManager {
    constructor(store) {
        this.store = store;
        this.tabContainer = document.querySelector('.tab-links');
        this.contentArea = document.querySelector('.tab-content');
        this.userRole = this.getUserRole();  // Assuming you have a method to fetch the user's role

        this.tabs = {
            'Businesses': 'Content related to businesses will be displayed here.',
            'Events': 'Here you can view and manage upcoming events.',
        };

        // Only add Office Content tab for roles other than 'user'
        if (this.userRole !== 'user') {
            this.tabs['Office Content'] = 'Office related information and tools.';
        }

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
    }

    getUserRole() {
        const token = localStorage.getItem('jwt');
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    }
}

export default TabManager