import ApiService from './apiService.js';
import TabManager from './components/tabManager.js';
import Router from './router.js';
import Store from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store({});
    const apiService = new ApiService();
    const router = new Router();
    const tabManager = new TabManager(store, apiService);

    apiService.fetch('user-role').then(data => {
        if (!data.role) {
            throw new Error('Role data is missing');
        }
        tabManager.userRole = data.role;
        tabManager.setupTabs();
        setTimeout(() => tabManager.loadTabContent('businesses'), 0);  // Ensure DOM is updated
    }).catch(error => {
        console.error("Failed to initialize tabs based on user role:", error);
    });
});



