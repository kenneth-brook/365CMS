import Router from '../services/router.js';
import Store from '../services/store.js';
import BusinessesTab from './tabs/businesesses/businessesTab.js';
import EventsTab from './tabs/events/eventTab.js';
import OfficeTab from './tabs/office/officeTab.js';

class TabManager {
  constructor(store, apiService, router) {
    this.store = store;
    this.apiService = apiService;
    this.router = router;
    this.initializeTabs();
  }

  initializeTabs() {
    new BusinessesTab(this.router);
    new EventsTab(this.router);
    new OfficeTab(this.router);
    // Default route to show something initially
    this.router.loadCurrentRoute('businesses/list'); // or another default route
  }
}

export default TabManager;
