import Router from './services/router.js';
import Store from './services/store.js';

document.addEventListener('DOMContentLoaded', async () => {
    const store = new Store({});
    const router = new Router();
    
    try {
        const ApiService = await import('./services/apiService.js');
        const apiService = new ApiService();
        const userData = await apiService.fetch('user-role');

        if (!userData.role) {
            throw new Error('Role data is missing');
        }

        // Store the user role in a centralized state management
        store.setUserRole(userData.role);

        const TabManager = await import('./components/tabManager.js');
        const tabManager = new TabManager(store, apiService, router);
        tabManager.setupTabs(); // tabManager no longer needs to know about userRole directly

        tabManager.tabs.forEach(tab => {
            router.addRoute(tab.id, () => tabManager.loadTabContent(tab.id));
        });

        router.loadCurrentRoute();
    } catch (error) {
        console.error("Failed to initialize tabs based on user role:", error);
        document.getElementById('content').innerHTML = '<p>Error loading the application. Please try again later.</p>';
    }
});



