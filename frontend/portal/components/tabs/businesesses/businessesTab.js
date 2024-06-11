import { eatForm, initializeEatForm } from './forms/eatForm.js';
import { stayForm, initializeStayForm } from './forms/stayForm.js';
import { playForm, initializePlayForm } from './forms/playForm.js';
import { shopForm, initializeShopForm } from './forms/shopForm.js';
import ListBusinesses from './listBusinesses.js'; // Ensure this import is present
import ApiService from '../../../services/apiService.js'; // Ensure ApiService is imported

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

    combinedForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('Form submission started');
      const formData = new FormData(combinedForm);

      try {
        console.log('Handling file uploads');
        await this.handleFileUploads(formData);
        console.log('File uploads handled successfully');

        // First submission for initial business data
        const initialFormData = new URLSearchParams();
        initialFormData.append('active', formData.get('active') ? 'true' : 'false');
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

        // Handling social media as JSON array
        const socialMediaArray = [];
        document.querySelectorAll('#social-media-list li').forEach((item) => {
          const platform = item.getAttribute('data-platform');
          const address = item.getAttribute('data-address');
          socialMediaArray.push({ platform, address });
        });
        initialFormData.append('socialMedia', JSON.stringify(socialMediaArray));

        initialFormData.append('logoUrl', formData.get('logoFile'));
        initialFormData.append('imageUrls', formData.getAll('imageFiles'));
        initialFormData.append('description', formData.get('description'));

        console.log('URLSearchParams:', initialFormData.toString());

        console.log('Submitting initial form data');
        const businessResponse = await this.apiService.createBusiness(initialFormData);

        if (businessResponse && businessResponse.id) {
          console.log('Initial form data submitted successfully');
          const businessId = businessResponse.id;
          combinedForm.querySelector('#businessId').value = businessId;

          // Second submission for business-specific data
          const detailsFormData = new URLSearchParams();
          detailsFormData.append('businessId', businessId);

          if (type === 'eat') {
            console.log('Preparing eat form data');
            const menuTypes = formData.getAll('menuType');
            detailsFormData.append('menuTypes', JSON.stringify(menuTypes.map(id => ({ id }))));
            detailsFormData.append('averageCost', formData.get('averageCost'));
            detailsFormData.append('operationModel', formData.get('operationModel'));
            detailsFormData.append('menuStyle', formData.get('menuStyle'));
            detailsFormData.append('daysOpen', JSON.stringify(formData.getAll('daysOpen')));
            detailsFormData.append('hoursOpen', JSON.stringify(formData.getAll('hoursOpen')));
            detailsFormData.append('special_day', formData.get('special-day'));
            detailsFormData.append('altered_hours', formData.get('altered-hours'));

            console.log('Submitting eat form data');
            const eatResponse = await this.apiService.submitEatForm(detailsFormData);

            if (eatResponse && eatResponse.eatFormId) {
              console.log('Eat form data submitted successfully');
              const eatId = eatResponse.eatFormId;
              const menuTypesArray = JSON.parse(detailsFormData.get('menuTypes'));
              for (const menuType of menuTypesArray) {
                await this.apiService.insertEatType(eatId, menuType.id);
              }
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
    console.log('Inside handleFileUploads function');
    // Example implementation of file uploads to DreamHost
    try {
      const logoFile = formData.get('logoFile');
      const imageFiles = formData.getAll('imageFiles');

      if (logoFile) {
        const logoFormData = new FormData();
        const uniqueLogoFilename = getUniqueFilename(logoFile.name);
        logoFormData.append('file', logoFile, uniqueLogoFilename);
        const logoUploadResult = await uploadFilesToDreamHost(logoFormData);
        console.log('Logo upload result:', logoUploadResult);
        formData.set('logoFile', logoUploadResult.url);  // Assuming 'url' contains the uploaded file URL
      }

      if (imageFiles && imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const imageFormData = new FormData();
          const uniqueImageFilename = getUniqueFilename(imageFile.name);
          imageFormData.append('file', imageFile, uniqueImageFilename);
          const imageUploadResult = await uploadFilesToDreamHost(imageFormData);
          console.log('Image upload result:', imageUploadResult);
          formData.append('imageFiles', imageUploadResult.url);  // Assuming 'url' contains the uploaded file URL
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }
}

export default BusinessesTab;
