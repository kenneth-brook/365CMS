export const renderImageUploadSection = () => {
  return `
    <div class="form-section" id="image-upload-section">
      <div class="form-group">
        <label for="imageUpload">Upload Images:</label>
        <input type="file" id="imageUpload" name="imageFiles" multiple>
      </div>
      <div id="image-thumbnails"></div>
      <ul id="image-file-list"></ul>
    </div>
  `;
};

export const attachImageUploadHandler = (formContainer) => {
  const imageUploadInput = formContainer.querySelector('#imageUpload');
  const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
  const imageFileListContainer = formContainer.querySelector('#image-file-list');

  const imageFiles = [];

  imageUploadInput.addEventListener('change', () => {
    const files = imageUploadInput.files;

    Array.from(files).forEach(file => {
      imageFiles.push(file);

      // Create and display thumbnail
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

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
          const index = imageFiles.indexOf(file);
          if (index > -1) {
            imageFiles.splice(index, 1);
          }
          imageThumbnailsContainer.removeChild(thumbnailContainer);
          imageFileListContainer.removeChild(listItem);
        });

        thumbnailContainer.appendChild(img);
        thumbnailContainer.appendChild(removeButton);
        imageThumbnailsContainer.appendChild(thumbnailContainer);

        // Display file name
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        imageFileListContainer.appendChild(listItem);
      };
      reader.readAsDataURL(file);
    });
  });

  return imageFiles; // Return imageFiles array to be used in form submission
};
