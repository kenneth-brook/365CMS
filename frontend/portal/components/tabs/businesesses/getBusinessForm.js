// /components/tabs/businesses/getBusinessForm.js

import ApiService from '../../../services/apiService.js';
import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';
import { renderAdditionalSection } from './renderAdditionalSection.js';

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

  // Include image files
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

const fetchAdditionalOptions = async () => {
  try {
    const dropdown = document.getElementById('additionalDropdown');
    if (!dropdown) {
      console.error('Dropdown element not found');
      return;
    }

    const options = await apiService.fetch('category-type');
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.category_name.toLowerCase(); // Use category_name as the value, converted to lowercase
      opt.textContent = option.category_name; // Use category_name as the display text
      dropdown.appendChild(opt);
    });
  } catch (error) {
    console.error('Error fetching additional options:', error);
  }
};

const addAdditionalSection = () => {
  const dropdown = document.getElementById('additionalDropdown');
  const selectedValue = dropdown.value;
  const selectedText = dropdown.options[dropdown.selectedIndex].text;
  const additionalSectionsContainer = document.querySelector('.additional-sections');

  // Log the selected value and text for debugging
  console.log(`Selected value: ${selectedValue}`);
  console.log(`Selected text: ${selectedText}`);
  
  // Create a new section based on the selected value
  const section = document.createElement('div');
  section.className = 'additional-section';
  const sectionContent = renderAdditionalSection(selectedValue);

  // Log the section content for debugging
  console.log(`Section content: ${sectionContent}`);
  
  section.innerHTML = `
    <form class="additional-form">
      <div class="form-section">
        <h3>Business Category: ${selectedText}</h3>
      </div>
      <div class="form-section">
        ${sectionContent}
      </div>
    </form>
  `;

  additionalSectionsContainer.appendChild(section);
  console.log('Appended section:', section);

  // Hide the dropdown and button
  document.querySelector('.additional-info-container').style.display = 'none';

  // Enable the Save button
  document.getElementById('saveBusinessButton').disabled = false;
};

const selectOnlyThis = (checkbox) => {
  const checkboxes = document.querySelectorAll('input[name="operationModel"]');
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
};

export const getBusinessForm = () => {
  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
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
    </form>
    <form class="additional-sections"> <!-- Start the new form here -->
    <div class="form-section additional-info-container">
      <label for="additionalDropdown">Additional Information</label>
      <select id="additionalDropdown" name="additionalDropdown">
        <option value="" disabled selected>Select a Category to Add to Continue</option>
      </select>
      <button type="button" id="addSectionButton">Add</button>
    </div>
    <div id="saveButtonContainer" class="form-section">
      <button type="submit" id="saveBusinessButton" disabled>Save Business</button>
    </div>
    </form>
    
  `;

  const imageFiles = attachImageUploadHandler(formContainer);
  attachSocialMediaHandlers(formContainer);
  attachLogoUploadHandler(formContainer);
  attachCoordinatesHandler(formContainer);

  setTimeout(() => {
    initializeTinyMCE();
    fetchAdditionalOptions(); // Ensure fetchAdditionalOptions is called after the DOM is ready
  }, 0);

  const form = formContainer.querySelector('#business-form');
  form.addEventListener('submit', (event) => handleFormSubmission(event, imageFiles));

  // Add event listener for the add button
  const addSectionButton = formContainer.querySelector('#addSectionButton');
  addSectionButton.addEventListener('click', addAdditionalSection);

  // Add event listeners for the operation model checkboxes
  const operationModelCheckboxes = formContainer.querySelectorAll('input[name="operationModel"]');
  operationModelCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => selectOnlyThis(checkbox));
  });

  return formContainer;
};
