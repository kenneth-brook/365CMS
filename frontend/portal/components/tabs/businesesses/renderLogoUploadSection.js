export const renderLogoUploadSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="logoUpload">Business Logo:</label>
          <input type="file" id="logoUpload" name="logoFile" accept="image/*">
        </div>
        <div id="logo-preview" class="thumbnail-container"></div>
      </div>
    `;
  };
  
  export const attachLogoUploadHandler = (formContainer) => {
    const logoUploadInput = formContainer.querySelector('#logoUpload');
    const logoPreviewContainer = formContainer.querySelector('#logo-preview');
  
    logoUploadInput.addEventListener('change', () => {
      const file = logoUploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          logoPreviewContainer.innerHTML = ''; // Clear previous logo preview
  
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = file.name;
          img.className = 'thumbnail';
  
          // Hover effect for enlargement
          img.addEventListener('mouseover', () => {
            const enlargeImg = document.createElement('img');
            enlargeImg.src = img.src;
            enlargeImg.className = 'enlarge-thumbnail';
            document.body.appendChild(enlargeImg);
  
            img.addEventListener('mousemove', (event) => {
              enlargeImg.style.top = `${event.clientY + 15}px`;
              enlargeImg.style.left = `${event.clientX + 15}px`;
            });
  
            img.addEventListener('mouseout', () => {
              document.body.removeChild(enlargeImg);
            });
          });
  
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.className = 'remove-button';
          removeButton.addEventListener('click', () => {
            logoPreviewContainer.innerHTML = ''; // Clear the logo preview
          });
  
          logoPreviewContainer.appendChild(img);
          logoPreviewContainer.appendChild(removeButton);
        };
        reader.readAsDataURL(file);
      }
    });
  };
  