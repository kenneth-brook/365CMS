import Router from './router.js';
import Store from './store.js';
import ApiService from './apiService.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store({});
    const apiService = new ApiService(localStorage.getItem('jwt'));
    const router = new Router();
    const tabManager = new TabManager(store);

    // Setup initial tab view
    tabManager.loadTabContent('Businesses');  // Set 'Home' as the default tab
});