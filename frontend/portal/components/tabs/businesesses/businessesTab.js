import { getBusinessForm } from './getBusinessForm.js';
//import EditBusiness from './EditBusiness.js';
import ListBusinesses from './listBusinesses.js';

import config from '../../../utils/config.js'

class BusinessesTab {
  constructor(router) {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('businesses/list', () => this.showListBusinesses());
    this.router.addRoute('businesses/add', () => this.showAddBusiness());
    this.router.addRoute('businesses/edit/:id', id => this.showEditBusiness(id));
  }

  showListBusinesses() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = ''; // Clear existing content
    const listBusinesses = new ListBusinesses(this.router);
    const renderedListBusinesses = listBusinesses.render();
    contentArea.appendChild(renderedListBusinesses);
  }

  showAddBusiness() {
    console.log("Showing add business form");
    this.addBusinessForm();
  }

  showEditBusiness(id) {
    console.log("Showing edit business form for ID:", id);
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = `<div>Edit Business with ID: ${id}</div>`;
    // More complex logic to display edit business form
  }

  addBusinessForm() {
    const toolArea = document.querySelector('.toolbar');
    const contentArea = document.querySelector('.tab-content');
    toolArea.innerHTML = '';
    contentArea.innerHTML = '';
    const businessForm = getBusinessForm(); // Get the form HTML
    contentArea.appendChild(businessForm); // Inject the form HTML

    // Initialize toggle functionality
    this.initializeToggle();

    // Initialize autofill button
    this.initializeAutofill();
  }

  initializeToggle() {
    const toggle = document.getElementById('active-toggle');
    const statusSpan = document.getElementById('toggle-status');

    if (toggle && statusSpan) {
      toggle.addEventListener('change', function() {
        console.log("Toggle state changed.");
        if (this.checked) {
          statusSpan.textContent = "Active";
          statusSpan.style.color = "green";
        } else {
          statusSpan.textContent = "Inactive";
          statusSpan.style.color = "red";
        }
      });
    } else {
      console.error("Failed to initialize toggle functionality - elements not found.");
    }
  }

  initializeAutofill() {
    const autofillButton = document.getElementById('autofill-button');
    autofillButton.addEventListener('click', this.handleAutofill.bind(this));
  }

  async handleAutofill() {
    const streetAddress = document.getElementById('streetAddress').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;

    const address = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
    const apiKey = config.google; // Replace with your actual API key

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        document.getElementById('latitude').value = location.lat;
        document.getElementById('longitude').value = location.lng;
        console.log("Autofill successful:", location);
      } else {
        console.error("Geocode was not successful for the following reason:", data.status);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  }
}

export default BusinessesTab;
