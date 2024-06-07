import { eatForm, initializeEatForm } from './forms/eatForm.js';
import { stayForm, initializeStayForm } from './forms/stayForm.js';
import { playForm, initializePlayForm } from './forms/playForm.js';
import { shopForm, initializeShopForm } from './forms/shopForm.js';
import ListBusinesses from './listBusinesses.js';

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
    this.displayBusinessTypeSelection();
  }

  showEditBusiness(id) {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = `<div>Edit Business with ID: ${id}</div>`;
    // More complex logic to display edit business form
  }

  displayBusinessTypeSelection() {
    const toolArea = document.querySelector('.toolbar');
    const contentArea = document.querySelector('.tab-content');
    toolArea.innerHTML = '';
    contentArea.innerHTML = '';

    const selectionHtml = `
      <div>
        <h3>Select The Type Of Business To Add</h3>
        <select id="business-type-select">
          <option value="eat">Eat</option>
          <option value="stay">Stay</option>
          <option value="play">Play</option>
          <option value="shop">Shop</option>
        </select>
        <button id="select-business-type-button">Select</button>
      </div>
    `;

    contentArea.innerHTML = selectionHtml;

    document.getElementById('select-business-type-button').addEventListener('click', () => {
      const selectedType = document.getElementById('business-type-select').value;
      this.loadBusinessForm(selectedType);
    });
  }

  loadBusinessForm(type) {
    const contentArea = document.querySelector('.tab-content');
    contentArea.innerHTML = ''; // Clear existing content

    let formHtml, initializeForm;
    switch(type) {
      case 'eat':
        formHtml = eatForm();
        initializeForm = initializeEatForm;
        break;
      case 'stay':
        formHtml = stayForm();
        initializeForm = initializeStayForm;
        break;
      case 'play':
        formHtml = playForm();
        initializeForm = initializePlayForm;
        break;
      case 'shop':
        formHtml = shopForm();
        initializeForm = initializeShopForm;
        break;
      default:
        console.error("Invalid business type selected");
        return;
    }

    contentArea.innerHTML = formHtml;
    this.initializeForm(contentArea, type, initializeForm);
  }

  initializeForm(formContainer, type, initializeForm) {
    initializeForm(formContainer);

    const combinedForm = formContainer.querySelector('#combined-form');

    combinedForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(combinedForm);

      const initialFormData = new FormData();
      initialFormData.append('businessName', formData.get('businessName'));
      initialFormData.append('streetAddress', formData.get('streetAddress'));
      initialFormData.append('mailingAddress', formData.get('mailingAddress'));
      initialFormData.append('city', formData.get('city'));
      initialFormData.append('state', formData.get('state'));
      initialFormData.append('zipCode', formData.get('zipCode'));
      initialFormData.append('latitude', formData.get('latitude'));
      initialFormData.append('longitude', formData.get('longitude'));
      initialFormData.append('phone', formData.get('phone'));
      initialFormData.append('email', formData.get('email'));
      initialFormData.append('website', formData.get('website'));
      initialFormData.append('socialPlatform', formData.get('socialPlatform'));
      initialFormData.append('socialAddress', formData.get('socialAddress'));
      initialFormData.append('logoFile', formData.get('logoFile'));
      initialFormData.append('imageFiles', formData.getAll('imageFiles'));
      initialFormData.append('description', formData.get('description'));
      initialFormData.append('menuType', formData.get('menuType'));
      initialFormData.append('newMenuType', formData.get('newMenuType'));
      initialFormData.append('averageCost', formData.get('averageCost'));

      const businessResponse = await ApiService.createBusiness(initialFormData);

      if (businessResponse && businessResponse.id) {
        const businessId = businessResponse.id;
        combinedForm.querySelector('#businessId').value = businessId;

        const detailsFormData = new FormData();
        detailsFormData.append('businessId', businessId);
        detailsFormData.append('operationModel', formData.get('operationModel'));
        detailsFormData.append('menuStyle', formData.get('menuStyle'));
        detailsFormData.append('daysOpen', formData.getAll('daysOpen'));
        detailsFormData.append('menuType', formData.getAll('menuType'));
        detailsFormData.append('hoursOpen', formData.getAll('hoursOpen'));

        await ApiService.createBusinessDetails(detailsFormData);
      }
    });
  }
}

export default BusinessesTab;
