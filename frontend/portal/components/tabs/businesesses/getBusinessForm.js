// /components/tabs/businesses/getBusinessForm.js

import ApiService from '../../../services/apiService.js';
import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';
import { renderAdditionalSection } from './renderAditionalSection.js';

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

  const form = event.target;
  const formData = new FormData(form);

  // Include the logo file
  const logoFile = form.querySelector('#logoUpload').files[0];
  if (logoFile) {
    const uniqueLogoFilename = getUniqueFilename(logoFile.name);
    formData.append('imageFiles[]', new File([logoFile], uniqueLogoFilename, { type: logoFile.type }));
  }

  // Include image files
  imageFiles.forEach((file) => {
    const uniqueImageFilename = getUniqueFilename(file.name);
    formData.append('imageFiles[]', new File([file], uniqueImageFilename, { type: file.type }));
  });

  try {
    // Upload files to DreamHost
    const uploadResult = await uploadFilesToDreamHost(formData);
    const uploadedFiles = uploadResult
      .filter((message) => message.includes('uploaded'))
      .map((message) => {
        const fileName = message.split(' ')[2];
        return `https://dev.365easyflow.com/easyflow-images/uploads/${fileName}`;
      });

    // Prepare the rest of the form data to send to Lambda
    const formDataToSend = {
      businessName: form.businessName?.value || '',
      active: form.active?.checked || false,
      streetAddress: form.streetAddress?.value || '',
      mailingAddress: form.mailingAddress?.value || '',
      city: form.city?.value || '',
      state: form.state?.value || '',
      zipCode: form.zipCode?.value || '',
      latitude: form.latitude?.value || '',
      longitude: form.longitude?.value || '',
      phone: form.phone?.value || '',
      email: form.email?.value || '',
      website: form.website?.value || '',
      socialMedia: form.querySelector('input[name="socialMedia"]').value || '[]', // Ensure default value is an empty array
      description: form.description?.value || '',
      chamberMember: form.chamberMember?.checked || false,
      logoUrl: uploadedFiles[0] || null, // Assuming the first file is the logo
      imageUrls: uploadedFiles.slice(1), // Rest are image files
      additionalSections: Array.from(form.querySelectorAll('.additional-sections .form-section')).map(section => ({
          sectionId: section.querySelector('input[name="additionalSectionId[]"]').value,
          additionalField: section.querySelector('input[name="additionalField[]"]').value
      }))
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

const fetchAdditionalOptions = async () => {
    const dropdown = document.getElementById('additionalDropdown');
    try {
        // Simulated options fetched from the API
        const options = [
            { id: 'eat', name: 'Eat' },
            { id: 'stay', name: 'Stay' },
            { id: 'play', name: 'Play' },
            { id: 'shop', name: 'Shop' },
            { id: 'other', name: 'Other' }
        ];
        
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.name;
            dropdown.appendChild(opt);
        });
    } catch (error) {
        console.error('Error fetching additional options:', error);
    }
};

const addAdditionalSection = () => {
    const dropdown = document.getElementById('additionalDropdown');
    const selectedValue = dropdown.value;
    const additionalSectionsContainer = document.querySelector('.additional-sections');

    // Create a new section based on the selected value
    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = renderAdditionalSection(selectedValue);
    additionalSectionsContainer.appendChild(section);

    // Enable the Save button
    document.getElementById('saveBusinessButton').disabled = false;
};

export const getBusinessForm = () => {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <form id="business-form" enctype="multipart/form-data">
      <div class="form-section">
        <div class="form-toggle">
          <label id="toggle-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
          <input type="checkbox" id="active-toggle" name="active">
        </div>
      </div>
      ${renderAddressSection()}
      ${renderCoordinatesSection()}
      ${renderContactSection()}
      ${renderSocialMediaSection()}
      ${renderLogoUploadSection()}
      ${renderImageUploadSection()}
      ${renderDescriptionSection()}
      <div class="additional-sections"></div>
      <div class="form-section">
        <label for="additionalDropdown">Primary Business Category</label>
        <select id="additionalDropdown" name="additionalDropdown"></select>
        <button type="button" id="addSectionButton">Add</button>
      </div>
      <button type="submit" id="saveBusinessButton" disabled>Save Business</button>
    </form>
  `;

  const imageFiles = attachImageUploadHandler(formContainer);
  attachSocialMediaHandlers(formContainer);
  attachLogoUploadHandler(formContainer);
  attachCoordinatesHandler(formContainer);

  setTimeout(() => {
    initializeTinyMCE();
  }, 0);

  const form = formContainer.querySelector('#business-form');
  form.addEventListener('submit', (event) => handleFormSubmission(event, imageFiles));

  // Fetch additional options for the dropdown
  fetchAdditionalOptions();

  // Add event listener for the add button
  const addSectionButton = formContainer.querySelector('#addSectionButton');
  addSectionButton.addEventListener('click', addAdditionalSection);

  return formContainer;
};
