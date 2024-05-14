import Router from '../services/router.js';
import Store from '../services/store.js';
import ApiService from '../services/apiService.js';
import BusinessesTab from './tabs/businesesses/businessesTab.js';
import EventsTab from './tabs/events/eventTab.js';
import OfficeTab from './tabs/office/officeTab.js';
import ListBusinesses from './tabs/businesesses/listBusinesses.js';

class TabManager {
  constructor(store, apiService, router) {
    this.store = store;
    this.apiService = apiService;
    this.router = router;
    this.tabs = [];
    this.tabContainer = document.querySelector('.tab-links');
    this.setupTabs();
  }

  setupTabs() {
    this.tabs.push({ id: 'businesses/list', title: 'Businesses', instance: new BusinessesTab(this.router) });
    this.tabs.push({ id: 'events/list', title: 'Events', instance: new EventsTab(this.router) });
    this.tabs.push({ id: 'office/list', title: 'Office', instance: new OfficeTab(this.router) });

    this.renderTabs();

    if (!window.location.hash) {
      this.router.navigate('businesses/list');
    } else {
      this.router.loadCurrentRoute();
    }
  }

  renderTabs() {
    if (!this.tabContainer) {
      console.error('Tab container not found');
      return;
    }

    this.tabs.forEach(tab => {
      const tabElement = document.createElement('li');
      const linkElement = document.createElement('a');
      linkElement.href = `#${tab.id}`;
      linkElement.textContent = tab.title;
      linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveTab(tab.id);
        this.router.navigate(tab.id);
      });
      tabElement.appendChild(linkElement);
      this.tabContainer.appendChild(tabElement);
    });

    // Set the active tab on page load
    this.setActiveTab(window.location.hash.slice(1));
  }

  setActiveTab(tabId) {
    const links = this.tabContainer.querySelectorAll('a');
    links.forEach(link => {
      if (link.href.endsWith(`#${tabId}`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  loadTabContent(tabId) {
    console.log('Loading tab content for:', tabId);
    const contentArea = document.querySelector('.tab-content');
    if (contentArea) {
      // Clear existing content
      contentArea.innerHTML = '';

      // Render content based on the active tab
      if (tabId === 'businesses/list') {
        const listBusinesses = new ListBusinesses();
        contentArea.appendChild(listBusinesses.render());
      } else {
        contentArea.innerHTML = `<div>Content for ${tabId}</div>`;
      }
    }
    this.setActiveTab(tabId);
  }
}

export default TabManager;

