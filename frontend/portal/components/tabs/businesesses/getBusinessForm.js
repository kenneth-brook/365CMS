import ApiService from '../../../services/apiService.js';
import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';
import { fetchAdditionalOptions, addAdditionalSection, selectOnlyThis, getUniqueId } from '../../../utils/formUtils.js';

const apiService = new ApiService();

const getUniqueFilename = (filename) => {
  const date = new Date().toISOString().replace(/[-:.]/g, '');
  return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
  try {
    const response = await fetch('https://dev.365easyflow.com/easyflow-images/upload.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

const handleMainFormSubmission = async (imageFiles) => {
  console.log('Main form submission started');

  const formContainer = document.getElementById('form-container');
  const mainForm = formContainer.querySelector('form');
  const mainFormData = new FormData(mainForm);

  imageFiles.forEach((file) => {
    const uniqueImageFilename = getUniqueFilename(file.name);
    mainFormData.append('imageFiles[]', new File([file], uniqueImageFilename, { type: file.type }));
  });

  try {
    const uploadResult = await uploadFilesToDreamHost(mainFormData);
    const uploadedFiles = uploadResult
      .filter((message) => message.includes('uploaded'))
      .map((message) => {
        const fileName = message.split(' ')[2];
        return `https://dev.365easyflow.com/easyflow-images/uploads/${fileName}`;
      });

    const formDataToSend = {
      ...Object.fromEntries(mainFormData.entries()),
      logoUrl: uploadedFiles[0] || null,
      imageUrls: uploadedFiles.slice(1),
    };

    console.log('Submitting main form data:', formDataToSend);

    const options = {
      method: 'POST',
      body: JSON.stringify(formDataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const result = await apiService.fetch('form-submission', options);
    console.log('Main form submission result:', result);
    return result.businessId; // Assume the backend returns the business ID
  } catch (error) {
    console.error('Error submitting the main form:', error);
    throw error;
  }
};

const handleSecondaryFormSubmission = async (businessId, formData, sectionType) => {
  formData.append('businessId', businessId);
  const options = {
    method: 'POST',
    body: formData,
  };

  let endpoint;
  switch (sectionType) {
    case 'eat':
      endpoint = 'eat-form-submission';
      break;
    case 'play':
      endpoint = 'play-form-submission';
      break;
    case 'stay':
      endpoint = 'stay-form-submission';
      break;
    case 'shop':
      endpoint = 'shop-form-submission';
      break;
    case 'other':
      endpoint = 'other-form-submission';
      break;
    default:
      throw new Error('Unknown section type');
  }

  try {
    console.log(`Submitting ${sectionType} form data:`, formData);
    const response = await apiService.fetch(endpoint, options);
    console.log(`${sectionType} form submission result:`, response);
    return response[`${sectionType}FormId`]; // Assume the backend returns the form ID
  } catch (error) {
    console.error(`Error submitting ${sectionType} form:`, error);
    throw error;
  }
};

const handleFormSubmission = async (event, imageFiles) => {
  event.preventDefault(); // Prevent default form submission behavior
  console.log('Form submission handler triggered');

  try {
    // Submit main form and get business ID
    const businessId = await handleMainFormSubmission(imageFiles);

    // Get all secondary forms
    const secondaryForms = document.querySelectorAll('.additional-section form');

    // Submit each secondary form
    for (const secondaryForm of secondaryForms) {
      const formData = new FormData(secondaryForm);
      const sectionType = secondaryForm.dataset.sectionType; // Assuming section type is stored in data attribute

      await handleSecondaryFormSubmission(businessId, formData, sectionType);
    }

    console.log('All forms submitted successfully');
    // Handle success (e.g., display a success message, redirect, etc.)
  } catch (error) {
    console.error('Error in form submission process:', error);
    // Handle error (e.g., display an error message)
  }
};

const initializeSections = (formContainer, uniqueId) => {
  const imageFiles = attachImageUploadHandler(formContainer);
  attachSocialMediaHandlers(formContainer, uniqueId);
  attachLogoUploadHandler(formContainer);
  attachCoordinatesHandler(formContainer);
  return imageFiles;
};

export const getBusinessForm = () => {
  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
  const uniqueId = getUniqueId('business-form');
  formContainer.innerHTML = `
    <form id="business-form-${uniqueId}" enctype="multipart/form-data">
      <div class="form-section">
        <div class="form-toggle">
          <label id="toggle-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
          <input type="checkbox" id="active-toggle" name="active">
        </div>
      </div>
      ${renderAddressSection(uniqueId)}
      ${renderCoordinatesSection(uniqueId)}
      ${renderContactSection(uniqueId)}
      ${renderSocialMediaSection(uniqueId)}
      ${renderLogoUploadSection(uniqueId)}
      ${renderImageUploadSection(uniqueId)}
      ${renderDescriptionSection(`description-${uniqueId}`)}
    </form>
    <div class="additional-sections-container" data-id="${uniqueId}">
      <form class="additional-sections">
        <div class="form-section additional-info-container">
          <label for="additionalDropdown">Additional Information</label>
          <select id="additionalDropdown" name="additionalDropdown">
            <option value="" disabled selected>Select a Category to Add to Continue</option>
          </select>
          <button type="button" id="addSectionButton-${uniqueId}">Add</button>
        </div>
      </form>
    </div>
  `;

  const imageFiles = initializeSections(formContainer, uniqueId);

  setTimeout(() => {
    initializeTinyMCE(`#description-${uniqueId}`);
    fetchAdditionalOptions(); // Ensure fetchAdditionalOptions is called after the DOM is ready
  }, 0);

  const form = formContainer.querySelector(`#business-form-${uniqueId}`);
  form.addEventListener('submit', (event) => handleFormSubmission(event, imageFiles));

  let firstAddonAdded = false;
  const addSectionButton = formContainer.querySelector(`#addSectionButton-${uniqueId}`);
  addSectionButton.addEventListener('click', () => {
    const newSectionId = getUniqueId('section');
    addAdditionalSection(firstAddonAdded, newSectionId);
    firstAddonAdded = true; // Mark that the first addon has been added
  });

  return formContainer;
};
