import ApiService from '../../../services/apiService.js';
import { renderAddressSection } from './sections/renderAddressSection.js';
import { renderCoordinatesSection, attachCoordinatesHandler } from './sections/renderCoordinatesSection.js';
import { renderContactSection } from './sections/renderContactSection.js';
import { renderSocialMediaSection, attachSocialMediaHandlers } from './sections/renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './sections/renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './sections/renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './sections/renderDescriptionSection.js';

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
    console.log('Files uploaded successfully:', result);
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

  // Log the FormData key-value pairs
  console.log('FormData before upload:');
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ', pair[1]);
    if (pair[1] instanceof File) {
      console.log(' - File details: ', {
        name: pair[1].name,
        type: pair[1].type,
        size: pair[1].size
      });
    }
  }

  try {
    // Upload files to DreamHost
    const uploadResult = await uploadFilesToDreamHost(formData);
    const uploadedFiles = uploadResult
      .filter((message) => message.includes('uploaded'))
      .map((message) => {
        const fileName = message.split(' ')[2];
        return `https://dev.365easyflow.com/easyflow-images/uploads/${fileName}`;
      });

    console.log('Uploaded Files URLs:', uploadedFiles);

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
      imageUrls: uploadedFiles.slice(1) // Rest are image files
    };

    console.log('FormData to send to Lambda:', formDataToSend);

    const options = {
      method: 'POST',
      body: JSON.stringify(formDataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const result = await apiService.fetch('form-submission', options);
    console.log('Form submitted successfully:', result);
    // Handle success (e.g., display a success message, redirect, etc.)
  } catch (error) {
    console.error('Error submitting the form:', error);
    // Handle error (e.g., display an error message)
  }
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
      <button type="submit">Save Business</button>
    </form>
  `;

  const imageFiles = attachImageUploadHandler(formContainer); // Get image files array
  attachSocialMediaHandlers(formContainer); // Attach event handlers for social media section
  attachLogoUploadHandler(formContainer);  // Attach event handler for logo upload
  attachCoordinatesHandler(formContainer); // Attach event handler for coordinates section

  // Initialize TinyMCE after the form is rendered
  setTimeout(() => {
    console.log("Initializing TinyMCE");
    initializeTinyMCE();
  }, 0);

  // Attach the form submission handler
  const form = formContainer.querySelector('#business-form');
  form.addEventListener('submit', (event) => handleFormSubmission(event, imageFiles));

  return formContainer;
};
