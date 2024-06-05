import { renderAddressSection } from './renderAddressSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './renderDescriptionSection.js';
import { renderSpecialDaySection, attachSpecialDayHandlers } from './renderSpecialDaySection.js';

export const renderCommonSections = (uniqueId) => {
  return `
    ${renderSpecialDaySection(uniqueId)}
    <div style="width: 100%" class="form-message form-section">
      <p style="text-align: center; font-weight: bold;">Only fill out the fields below if they differ from the main form.</p>
    </div>
    ${renderAddressSection()}
    ${renderSocialMediaSection()}
    ${renderLogoUploadSection()}
    ${renderImageUploadSection()}
    ${renderDescriptionSection(uniqueId)}
    <div id="saveButtonContainer" class="form-section">
      <button type="button" id="saveBusinessButton-${uniqueId}">Save Business</button>
    </div>
  `;
};

export const attachCommonHandlers = (formContainer, uniqueId, dayHoursArray) => {
  if (formContainer) {
    attachSocialMediaHandlers(formContainer);
    attachLogoUploadHandler(formContainer);
    attachImageUploadHandler(formContainer);
    attachSpecialDayHandlers(uniqueId, dayHoursArray);
    initializeTinyMCE('.description');

    const saveButton = formContainer.querySelector(`#saveBusinessButton-${uniqueId}`);
    if (saveButton) {
      saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const form = formContainer.querySelector(`#business-form-${uniqueId}`);
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
    }
  } else {
    console.error('Form container not found');
  }
};
