import { eatForm, initializeEatForm } from './forms/eatForm.js';
import { stayForm, initializeStayForm } from './forms/stayForm.js';
import { playForm, initializePlayForm } from './forms/playForm.js';
import { shopForm, initializeShopForm } from './forms/shopForm.js';
import ListBusinesses from './listBusinesses.js'; // Ensure this import is present

const getUniqueFilename = (filename) => {
  const date = new Date().toISOString().replace(/[-:.]/g, '');
  return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
  try {
    console.log('Uploading files to DreamHost');
    const response = await fetch('https://dev.365easyflow.com/easyflow-images/upload.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Upload result:', result);
    return result;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

class BusinessesTab {
  constructor(router, apiService) {
    this.router = router;
    this.apiService = apiService; // Store the instance of ApiService
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
  const submitButton = formContainer.querySelector('#submitButton');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default button behavior
    console.log('Submit button clicked and default prevented');

    const formData = new FormData(combinedForm);
    
    try {
      console.log('Handling file uploads');
      const { logoUrl, imageUrls } = await this.handleFileUploads(formData);
      console.log(`File uploads handled successfully: ${JSON.stringify({ logoUrl, imageUrls })}`);
      
      

      // First submission for initial business data
      const initialFormData = new URLSearchParams();
      initialFormData.append('active', formData.get('active') ? 'true' : 'false');
      initialFormData.append('businessName', formData.get('businessName'));
      initialFormData.append('streetAddress', formData.get('streetAddress'));
      initialFormData.append('mailingAddress', formData.get('mailingAddress'));
      initialFormData.append('city', formData.get('city'));
      initialFormData.append('state', formData.get('state'));
      initialFormData.append('zipCode', formData.get('zipCode'));
      initialFormData.append('latitude', formData.get('latitude') || '');
      initialFormData.append('longitude', formData.get('longitude') || '');
      initialFormData.append('phone', formData.get('phone'));
      initialFormData.append('email', formData.get('email'));
      initialFormData.append('website', formData.get('website'));

      // Handling social media as JSON array
      const socialMediaArray = [];
      document.querySelectorAll('#social-media-list li').forEach((item) => {
        const platform = item.getAttribute('data-platform');
        const address = item.getAttribute('data-address');
        socialMediaArray.push({ platform, address });
      });
      initialFormData.append('socialMedia', JSON.stringify(socialMediaArray));

      initialFormData.append('logoUrl', formData.get('logoFile') || '');
      initialFormData.append('imageUrls', JSON.stringify(formData.getAll('imageFiles').map(file => file.name)));
      initialFormData.append('description', formData.get('description'));

      // Verify URLSearchParams before submission
      console.log('URLSearchParams:', initialFormData.toString());

      console.log('Submitting initial form data');
      const businessResponse = await this.apiService.createBusiness(initialFormData);
//debugger;
if (businessResponse && businessResponse.id) {
  console.log('Initial form data submitted successfully');
  const businessId = businessResponse.id;

  // Update the form with the returned business ID
  const businessIdField = document.createElement('input');
  businessIdField.type = 'hidden';
  businessIdField.id = 'businessId';
  businessIdField.name = 'businessId';
  businessIdField.value = businessId;
  combinedForm.appendChild(businessIdField);

  // Second submission for business-specific data
  const detailsFormData = new URLSearchParams();
  detailsFormData.append('businessId', businessId);

  if (type === 'eat') {
    console.log('Preparing eat form data');
    const menuTypes = formData.getAll('menuType');
    detailsFormData.append('menuTypes', JSON.stringify(menuTypes.map(id => ({ id }))));
    detailsFormData.append('averageCost', formData.get('averageCost'));

    const specialDays = [];
    document.querySelectorAll('.day-hours-item').forEach((item) => {
      const day = item.getAttribute('data-day');
      const hours = item.getAttribute('data-hours');
      specialDays.push({ day, hours });
    });
    detailsFormData.append('special_days', JSON.stringify(specialDays));

    console.log('Details Form Data:', detailsFormData.toString());

    try {
      const eatResponse = await this.apiService.submitEatForm(detailsFormData);
      console.log('Eat form data submitted', eatResponse);

      if (eatResponse && eatResponse.eatFormId) {
        const eatId = eatResponse.eatFormId;
        const menuTypesArray = JSON.parse(detailsFormData.get('menuTypes'));
        for (const menuType of menuTypesArray) {
          await this.apiService.insertEatType(eatId, menuType.id);
        }
      }
    } catch (error) {
      console.error('Error submitting eat form:', error);
    }
  }

        // Add other type-specific fields as needed
        if (type === 'play') {
          console.log('Preparing play form data');
          // Add play-specific fields
        }

        if (type === 'shop') {
          console.log('Preparing shop form data');
          // Add shop-specific fields
        }

        if (type === 'stay') {
          console.log('Preparing stay form data');
          // Add stay-specific fields
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
}

  async handleFileUploads(formData) {
    console.log('Handling file uploads');
    const logoFile = formData.get('logoFile');
    const imageFiles = formData.getAll('imageFiles');

    let logoUrl = '';
    let imageUrls = [];

    if (logoFile) {
      const logoFormData = new FormData();
      const uniqueLogoFilename = getUniqueFilename(logoFile.name);
      logoFormData.append('file', logoFile, uniqueLogoFilename);
      const logoUploadResult = await uploadFilesToDreamHost(logoFormData);
      if (logoUploadResult && logoUploadResult[0]) {
        logoUrl = logoUploadResult[0].url;
      }
    }

    if (imageFiles.length > 0) {
      const imagesFormData = new FormData();
      imageFiles.forEach((file) => {
        const uniqueImageFilename = getUniqueFilename(file.name);
        imagesFormData.append('files[]', file, uniqueImageFilename);
      });
      const imagesUploadResult = await uploadFilesToDreamHost(imagesFormData);
      if (imagesUploadResult && imagesUploadResult.length > 0) {
        imageUrls = imagesUploadResult.map(img => img.url);
      }
    }

    return { logoUrl, imageUrls };
  }
}

export default BusinessesTab;
