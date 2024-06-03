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

const handleFormSubmission = async (event, imageFiles) => {
  event.preventDefault();

  const formContainer = document.getElementById('form-container');
  const forms = formContainer.querySelectorAll('form');
  const allFormData = new FormData();

  forms.forEach(form => {
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      allFormData.append(key, value);
    }
  });

  imageFiles.forEach((file) => {
    const uniqueImageFilename = getUniqueFilename(file.name);
    allFormData.append('imageFiles[]', new File([file], uniqueImageFilename, { type: file.type }));
  });

  try {
    const uploadResult = await uploadFilesToDreamHost(allFormData);
    const uploadedFiles = uploadResult
      .filter((message) => message.includes('uploaded'))
      .map((message) => {
        const fileName = message.split(' ')[2];
        return `https://dev.365easyflow.com/easyflow-images/uploads/${fileName}`;
      });

    const formDataToSend = {
      ...Object.fromEntries(allFormData.entries()),
      logoUrl: uploadedFiles[0] || null,
      imageUrls: uploadedFiles.slice(1),
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(formDataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const result = await apiService.fetch('form-submission', options);
    // Handle success (e.g., display a success message, redirect, etc.)
  } catch (error) {
    console.error('Error submitting the form:', error);
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

const ensureElementExists = (selector, callback) => {
  const checkInterval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(checkInterval);
      callback();
    }
  }, 100);
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

  const descriptionSelector = `#description-${uniqueId}`;
  ensureElementExists(descriptionSelector, () => {
    initializeTinyMCE(descriptionSelector);
    fetchAdditionalOptions(); // Ensure fetchAdditionalOptions is called after the DOM is ready
  });

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
