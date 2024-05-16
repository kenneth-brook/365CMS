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
        ${renderImageUploadSection()}
        ${renderDescriptionSection()}
        <button type="submit">Save Business</button>
      </form>
    `;
    
    attachSocialMediaHandlers(formContainer); // Attach event handlers for social media section
    attachImageUploadHandler(formContainer); // Attach event handler for image uploads
  
    // Initialize TinyMCE after the form is rendered
    setTimeout(() => {
      console.log("Initializing TinyMCE");
      initializeTinyMCE();
    }, 0);
  
    return formContainer;
  };
  
  const renderAddressSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="businessName">Business Name:</label>
          <input type="text" id="businessName" name="businessName">
        </div>
        <div class="form-group">
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress">
        </div>
        <div class="form-group">
          <label for="mailingAddress">Mailing Address:</label>
          <input type="text" id="mailingAddress" name="mailingAddress">
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" name="city">
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" name="state">
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" name="zipCode">
        </div>
      </div>
    `;
  };
  
  const renderCoordinatesSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="text" id="latitude" name="latitude" readonly>
        </div>
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="text" id="longitude" name="longitude" readonly>
        </div>
        <button type="button" id="autofill-button">Auto Fill</button>
      </div>
    `;
  };
  
  const renderContactSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email">
        </div>
        <div class="form-group">
          <label for="website">Website:</label>
          <input type="url" id="website" name="website">
        </div>
      </div>
    `;
  };
  
  const renderSocialMediaSection = () => {
    return `
      <div class="form-section" id="social-media-section">
        <div class="form-group">
          <label for="socialPlatform">Social Platform:</label>
          <input type="text" id="socialPlatform" name="socialPlatform">
        </div>
        <div class="form-group">
          <label for="socialAddress">Social Address:</label>
          <input type="text" id="socialAddress" name="socialAddress">
        </div>
        <button type="button" id="add-social-media">Add</button>
        <ul id="social-media-list"></ul>
      </div>
    `;
  };
  
  const renderImageUploadSection = () => {
    return `
      <div class="form-section" id="image-upload-section">
        <div class="form-group">
          <label for="imageUpload">Upload Images:</label>
          <input type="file" id="imageUpload" name="imageUpload" multiple>
        </div>
        <div id="image-thumbnails"></div>
        <ul id="image-file-list"></ul>
      </div>
    `;
  };
  
  const renderDescriptionSection = () => {
    return `
      <div class="form-section description-section">
        <div class="description-container">
          <label for="description">Description:</label>
          <textarea id="description" name="description"></textarea>
        </div>
      </div>
    `;
  };
  
  const attachSocialMediaHandlers = (formContainer) => {
    const addButton = formContainer.querySelector('#add-social-media');
    const socialMediaList = formContainer.querySelector('#social-media-list');
  
    const socialMediaPairs = [];
  
    addButton.addEventListener('click', () => {
      const platformInput = formContainer.querySelector('#socialPlatform');
      const addressInput = formContainer.querySelector('#socialAddress');
  
      const platform = platformInput.value.trim();
      const address = addressInput.value.trim();
  
      if (platform && address) {
        socialMediaPairs.push({ platform, address });
        const listItem = document.createElement('li');
        listItem.textContent = `${platform}: ${address}`;
        socialMediaList.appendChild(listItem);
  
        // Clear inputs
        platformInput.value = '';
        addressInput.value = '';
      }
    });
  
    // Attach to form submission to include social media data
    const form = formContainer.querySelector('#business-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Include social media pairs in the form submission data
      const formData = new FormData(form);
      formData.append('socialMedia', JSON.stringify(socialMediaPairs));
  
      // Handle form submission (e.g., send formData to the server)
      // For demonstration, let's log the data
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Optionally, submit the form data using fetch or any other method
    });
  };
  
  const attachImageUploadHandler = (formContainer) => {
    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');
  
    const imageFiles = [];
  
    imageUploadInput.addEventListener('change', () => {
      const files = imageUploadInput.files;
      imageThumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
      imageFileListContainer.innerHTML = ''; // Clear existing file names
      imageFiles.length = 0; // Clear the array
  
      Array.from(files).forEach(file => {
        imageFiles.push(file);
  
        // Create and display thumbnail
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = file.name;
          img.className = 'thumbnail';
          imageThumbnailsContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
  
        // Display file name
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        imageFileListContainer.appendChild(listItem);
      });
    });
  
    // Attach to form submission to include image files
    const form = formContainer.querySelector('#business-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Include image files in the form submission data
      const formData = new FormData(form);
      imageFiles.forEach((file, index) => {
        formData.append(`imageFile${index}`, file);
      });
  
      // Handle form submission (e.g., send formData to the server)
      // For demonstration, let's log the data
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Optionally, submit the form data using fetch or any other method
    });
  };
  
  const initializeTinyMCE = () => {
    console.log("TinyMCE initializing");
    tinymce.init({
      selector: '#description',
      license_key: 'gpl',
      plugins: 'link code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
    });
  };
  