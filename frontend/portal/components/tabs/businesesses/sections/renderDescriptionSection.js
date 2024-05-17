export const renderDescriptionSection = () => {
    return `
      <div class="form-section description-section">
        <div class="description-container">
          <label for="description">Business Description:</label>
          <textarea id="description" name="description"></textarea>
        </div>
      </div>
    `;
  };
  
  export const initializeTinyMCE = () => {
    tinymce.init({
      selector: '#description',
      license_key: 'gpl',
      plugins: 'link code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
    });
  };
  