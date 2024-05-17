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

  return formContainer;
};
