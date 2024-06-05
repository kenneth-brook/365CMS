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

export const getMenuTypes = async (section) => {
  console.log(`The section for table location is: ${section}`)
  const tableName = `${section}_type`;
  try {
    const response = await apiService.fetch(`menu-types?table=${tableName}`);
    console.log('Fetched menu types:', response); // Logging the response
    return response; // Assuming response is the expected array
  } catch (error) {
    console.error(`Error fetching menu types for section ${section}:`, error);
    return [];
  }
};

export const getAverageCosts = async (section) => {
  if (section === 'eat' || section === 'stay') {
    const tableName = `${section}_cost`;
    try {
      console.log(`Fetching average costs for table: ${tableName}`);
      const response = await apiService.fetch(`average-costs?table=${tableName}`);
      console.log('Fetched average costs:', response); // Logging the response
      return response;
    } catch (error) {
      console.error(`Error fetching average costs for section ${section}:`, error);
      return [];
    }
  }
  return [];
};

export const addNewMenuType = async (newMenuType, section) => {
  const tableName = `${section}_type`;
  try {
    const response = await apiService.fetch('menu-types', {
      method: 'POST',
      body: JSON.stringify({ name: newMenuType, table: tableName }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('New menu type added:', response); // Logging the response
    return response; // Assuming response is the expected object
  } catch (error) {
    console.error(`Error adding new menu type for section ${section}:`, error);
    return { id: Date.now(), name: newMenuType }; // Fallback to a mock response
  }
};

export const getUniqueId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const addAdditionalSection = (firstAddonAdded, uniqueId) => {
  const dropdown = document.getElementById('additionalDropdown');
  const selectedValue = dropdown.value;
  const selectedText = dropdown.options[dropdown.selectedIndex].text;
  const additionalSectionsContainer = document.querySelector('.additional-sections-container');
  const additionalInfoContainer = document.querySelector('.additional-info-container');

  const { sectionHtml, attachHandlers } = renderAdditionalSection(selectedValue, uniqueId);

  const newForm = document.createElement('form');
  newForm.className = 'additional-section';
  newForm.setAttribute('data-id', uniqueId);
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
    attachHandlers(); // Attach handlers now that the section is in the DOM
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
