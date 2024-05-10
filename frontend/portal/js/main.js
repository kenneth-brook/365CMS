import ApiService from './apiService.js';
import TabManager from './components/tabManager.js';
import Router from './router.js';
import Store from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store({});
    const apiService = new ApiService(); // Initialize ApiService without JWT
    const router = new Router();

    const tabManager = new TabManager(store, apiService);
    tabManager.fetchUserRole().then(role => {
        tabManager.setupTabs();  // Setup tabs based on user role
        tabManager.loadTabContent('Businesses');  // Set 'Businesses' as the default tab
    }).catch(error => {
        console.error("Failed to initialize tabs based on user role:", error);
        // Handle initialization error (e.g., redirect to login or show error message)
    });
});
