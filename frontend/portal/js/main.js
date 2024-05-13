import ApiService from './apiService.js';
import Router from './router.js';
import Store from './store.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store({});
    const apiService = new ApiService();
    const router = new Router();
    const tabManager = new TabManager(store, apiService, router);

    apiService.fetch('user-role').then(data => {
        if (!data.role) {
            throw new Error('Role data is missing');
        }
        tabManager.userRole = data.role;
        tabManager.setupTabs();

        // Define routes for each tab
        tabManager.tabs.forEach(tab => {
            router.addRoute(tab.id, () => tabManager.loadTabContent(tab.id));
        });

        // Navigate to the initial route based on the current URL or set default
        router.loadCurrentRoute();
    }).catch(error => {
        console.error("Failed to initialize tabs based on user role:", error);
    });
});

