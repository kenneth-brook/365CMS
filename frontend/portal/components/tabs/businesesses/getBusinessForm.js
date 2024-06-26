import ApiService from '../../../services/apiService.js';
import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';
import { fetchAdditionalOptions, getUniqueId } from '../../../utils/formUtils.js';
import { renderAdditionalSection } from './renderAdditionalSection.js';

const apiService = new ApiService();

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
    console.log('Files uploaded:', uploadResult);

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
  console.log(`Prepared secondary form data for section: ${sectionType}`, Object.fromEntries(formData.entries()));

  // Log the endpoint that would be used
  const endpoints = {
    eat: 'eat-form-submission',
    play: 'play-form-submission',
    stay: 'stay-form-submission',
    shop: 'shop-form-submission',
    other: 'other-form-submission',
  };

  const endpoint = endpoints[sectionType];
  console.log(`Endpoint for ${sectionType}: ${endpoint}`);
  return; // Skip actual submission for logging purposes
};

const handleFormSubmission = async (event, imageFiles) => {
  event.preventDefault(); // Prevent default form submission behavior
  console.log('Form submission handler triggered');

  try {
    // Submit main form and get business ID
    const businessId = await handleMainFormSubmission(imageFiles);

    // Get all secondary forms
    const secondaryForms = document.querySelectorAll('.additional-section form');
    console.log(`Found ${secondaryForms.length} secondary forms to submit.`);

    // Submit each secondary form
    for (const secondaryForm of secondaryForms) {
      const formData = new FormData(secondaryForm);
      const sectionType = secondaryForm.dataset.sectionType; // Assuming section type is stored in data attribute

      await handleSecondaryFormSubmission(businessId, formData, sectionType);
    }

    console.log('All forms processed successfully');
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

  // Ensure elements are available before fetching additional options and adding event listeners
  setTimeout(() => {
    initializeTinyMCE(`#description-${uniqueId}`);

    const additionalDropdown = formContainer.querySelector('#additionalDropdown');
    const addSectionButton = formContainer.querySelector(`#addSectionButton-${uniqueId}`);
    const form = formContainer.querySelector(`#business-form-${uniqueId}`);

    if (additionalDropdown && addSectionButton && form) {
      fetchAdditionalOptions();

      addSectionButton.addEventListener('click', () => {
        const selectedOption = additionalDropdown.value;
        if (selectedOption) {
          const newSectionId = getUniqueId('section');
          const { sectionHtml, attachHandlers } = renderAdditionalSection(selectedOption, newSectionId);

          const additionalSectionsContainer = formContainer.querySelector('.additional-sections-container');
          const newSection = document.createElement('div');
          newSection.classList.add('additional-section');
          newSection.dataset.id = newSectionId;
          newSection.dataset.sectionType = selectedOption; // Set section type for later use
          newSection.innerHTML = `<form id="additional-form-${newSectionId}">${sectionHtml}</form>`;

          additionalSectionsContainer.appendChild(newSection);

          // Attach handlers after section is added to the DOM
          attachHandlers();
        }
      });

      form.addEventListener('submit', (event) => handleFormSubmission(event, imageFiles));
    } else {
      console.error('Required elements not found');
    }
  }, 0);

  return formContainer;
};
