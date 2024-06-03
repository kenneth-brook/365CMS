export const renderSocialMediaSection = (index) => {
  return `
    <div class="form-section" id="social-media-section-${index}">
      <div class="form-group">
        <label for="socialPlatform-${index}">Social Platform:</label>
        <input type="text" id="socialPlatform-${index}" name="socialPlatform-${index}">
      </div>
      <div class="form-group">
        <label for="socialAddress-${index}">Social Address:</label>
        <input type="text" id="socialAddress-${index}" name="socialAddress-${index}">
      </div>
      <button type="button" id="add-social-media-${index}">Add</button>
      <ul id="social-media-list-${index}"></ul>
    </div>
  `;
};

export const attachSocialMediaHandlers = (formContainer, index) => {
  const addButton = formContainer.querySelector(`#add-social-media-${index}`);
  const socialMediaList = formContainer.querySelector(`#social-media-list-${index}`);

  if (!addButton || !socialMediaList) {
    console.error('One or more elements not found for Social Media handlers');
    return;
  }

  const socialMediaPairs = [];

  addButton.addEventListener('click', () => {
    const platformInput = formContainer.querySelector(`#socialPlatform-${index}`);
    const addressInput = formContainer.querySelector(`#socialAddress-${index}`);

    if (!platformInput || !addressInput) {
      console.error('Social media inputs not found');
      return;
    }

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

  // Store the social media pairs in the form container for later retrieval
  formContainer.socialMediaPairs = socialMediaPairs;
};