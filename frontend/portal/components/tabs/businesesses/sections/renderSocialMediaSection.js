export const renderSocialMediaSection = () => {
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

export const attachSocialMediaHandlers = (formContainer) => {
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

    // Store social media pairs in a hidden input field
    const socialMediaInput = document.createElement('input');
    socialMediaInput.type = 'hidden';
    socialMediaInput.name = 'socialMedia';
    socialMediaInput.value = JSON.stringify(socialMediaPairs);
    form.appendChild(socialMediaInput);
  });
};
