import ApiService from '../services/apiService.js';
import { renderAdditionalSection } from '../components/tabs/businesesses/renderAdditionalSection.js';

const apiService = new ApiService();

export const fetchAdditionalOptions = async () => {
  try {
    const dropdown = document.getElementById('additionalDropdown');
    if (!dropdown) {
      console.error('Dropdown element not found');
      return;
    }

    const options = await apiService.fetch('category-type');
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.category_name.toLowerCase();
      opt.textContent = option.category_name;
      dropdown.appendChild(opt);
    });
  } catch (error) {
    console.error('Error fetching additional options:', error);
  }
};

export const addAdditionalSection = (firstAddonAdded) => {
  const dropdown = document.getElementById('additionalDropdown');
  const selectedValue = dropdown.value;
  const selectedText = dropdown.options[dropdown.selectedIndex].text;
  const additionalSectionsContainer = document.querySelector('.additional-sections-container');
  const additionalInfoContainer = document.querySelector('.additional-info-container');

  const { sectionHtml, attachHandlers } = renderAdditionalSection(selectedValue);

  const newForm = document.createElement('form');
  newForm.className = 'additional-section';
  newForm.innerHTML = `
    <div class="form-section">
      <h3>Business Category: ${selectedText}</h3>
      ${sectionHtml}
    </div>
  `;

  // Append the new form
  additionalSectionsContainer.appendChild(newForm);

  // Move additionalInfoContainer to the bottom to ensure it's always last
  additionalSectionsContainer.appendChild(additionalInfoContainer);

  if (attachHandlers) {
    attachHandlers(newForm);
  }

  if (!firstAddonAdded) {
    additionalInfoContainer.style.display = 'none';
  }
};

export const selectOnlyThis = (checkbox, groupName, callback) => {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
  if (callback) {
    callback(checkbox);
  }
};

// Expose the function to the global scope if needed
window.selectOnlyThis = selectOnlyThis;