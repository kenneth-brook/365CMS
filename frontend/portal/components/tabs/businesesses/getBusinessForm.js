import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';

export const getBusinessForm = () => {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <form id="business-form">
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
      <button type="submit">Save Business</button>
    </form>
  `;
  
  attachSocialMediaHandlers(formContainer); // Attach event handlers for social media section
  attachImageUploadHandler(formContainer); // Attach event handler for image uploads
  attachLogoUploadHandler(formContainer);  // Attach event handler for logo upload
  attachCoordinatesHandler(formContainer); // Attach event handler for coordinates section

  // Initialize TinyMCE after the form is rendered
  setTimeout(() => {
    console.log("Initializing TinyMCE");
    initializeTinyMCE();
  }, 0);

  // Attach the form submission handler
  const form = formContainer.querySelector('#business-form');
  form.addEventListener('submit', handleFormSubmission);

  return formContainer;
};

// Function to handle form submission
const handleFormSubmission = async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Include the logo file
  const logoFile = form.querySelector('#logoUpload').files[0];
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  // Include image files
  const imageFiles = Array.from(form.querySelector('#imageUpload').files);
  imageFiles.forEach((file, index) => {
    formData.append(`imageFile${index}`, file);
  });

  // Handle form submission (e.g., send formData to the server)
  try {
    const response = await fetch('/api/businesses', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to submit the form');
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    // Handle success (e.g., display a success message, redirect, etc.)
  } catch (error) {
    console.error('Error submitting the form:', error);
    // Handle error (e.g., display an error message)
  }
};
