import Router from './services/router.js';
import Store from './services/store.js';
import ApiService from './services/apiService.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  const store = new Store({});
  const router = new Router();

  try {
    const apiService = new ApiService(); // Instantiate ApiService
    console.log("API Service loaded");

    const userData = await apiService.fetch('user-role');
    console.log("User role fetched:", userData.role);

    if (!userData.role) {
      throw new Error('Role data is missing');
    }

    const tabManager = new TabManager(store, apiService, router);
    console.log("TabManager instance created:", tabManager);

    // Register routes based on the available tabs
    tabManager.tabs.forEach(tab => {
      router.addRoute(tab.id, () => tabManager.loadTabContent(tab.id));
    });

    // Register a default route to handle the initial load or unknown routes
    router.addRoute('default', () => {
      console.log('Default route action');
      router.navigate('businesses/list'); // Navigate to a default tab
    });

    router.loadCurrentRoute();
  } catch (error) {
    console.error("Failed to initialize tabs based on user role:", error);
    document.getElementById('content').innerHTML = '<p>Error loading the application. Please try again later.</p>';
  }
});
