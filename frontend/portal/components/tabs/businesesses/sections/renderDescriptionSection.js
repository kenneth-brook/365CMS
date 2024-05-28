export const renderDescriptionSection = (id) => {
  return `
    <div class="form-section description-section">
      <div class="description-container">
        <label for="description-${id}">Business Description:</label>
        <textarea id="description-${id}" class="description" name="description-${id}"></textarea>
      </div>
    </div>
  `;
};

export const initializeTinyMCE = (selector) => {
  tinymce.init({
    selector: selector,
    license_key: 'gpl',
    plugins: 'link code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
  });
};

  