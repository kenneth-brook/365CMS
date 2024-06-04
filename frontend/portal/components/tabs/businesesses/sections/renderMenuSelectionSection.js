import { getMenuTypes, getAverageCosts, addNewMenuType } from '../../../../utils/formUtils.js';

export const renderMenuSelectionSection = (section, labels) => {
  return `
    <div class="form-section" id="menu-selection-section-${section}">
      <div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">
        <div class="form-group">
          <label for="menuType-${section}">${labels.menuTypeLabel}:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <select id="menuType-${section}" name="menuType-${section}"></select>
            <button type="button" id="add-menu-type-${section}">Add Selection</button>
          </div>
        </div>
        <div class="form-group">
          <label for="newMenuType-${section}">${labels.newMenuTypeLabel}:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="newMenuType-${section}" name="newMenuType-${section}">
            <button type="button" id="add-new-menu-type-${section}">Add</button>
          </div>
        </div>
        ${labels.showAverageCost ? `
        <div class="form-group">
          <label for="averageCost-${section}">${labels.averageCostLabel}:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <select id="averageCost-${section}" name="averageCost-${section}"></select>
          </div>
        </div>
        ` : ''}
      </div>
      <ul id="menu-type-list-${section}"></ul>
    </div>
  `;
};

export const attachMenuSelectionHandlers = async (formContainer, section) => {
  const menuTypeDropdown = formContainer.querySelector(`#menuType-${section}`);
  const averageCostDropdown = formContainer.querySelector(`#averageCost-${section}`);
  const addMenuTypeButton = formContainer.querySelector(`#add-menu-type-${section}`);
  const addNewMenuTypeButton = formContainer.querySelector(`#add-new-menu-type-${section}`);
  const newMenuTypeInput = formContainer.querySelector(`#newMenuType-${section}`);
  const menuTypeList = formContainer.querySelector(`#menu-type-list-${section}`);

  if (!menuTypeDropdown || (!averageCostDropdown && (section === 'eat' || section === 'stay')) || !addMenuTypeButton || !addNewMenuTypeButton || !newMenuTypeInput || !menuTypeList) {
    console.error('One or more elements not found in the form container:', {
      menuTypeDropdown,
      averageCostDropdown,
      addMenuTypeButton,
      addNewMenuTypeButton,
      newMenuTypeInput,
      menuTypeList
    });
    return;
  }

  const menuTypes = [];

  // Fetch initial data
  const fetchedMenuTypes = await getMenuTypes(section);
  fetchedMenuTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    menuTypeDropdown.appendChild(option);
  });

  if (section === 'eat' || section === 'stay') {
    const fetchedAverageCosts = await getAverageCosts(section);
    fetchedAverageCosts.forEach(cost => {
      const option = document.createElement('option');
      option.value = cost.id;
      option.textContent = cost.name;
      averageCostDropdown.appendChild(option);
    });
  }

  // Add existing menu type selection
  addMenuTypeButton.addEventListener('click', () => {
    const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
    if (selectedOption) {
      const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
      menuTypeList.appendChild(listItem);
      menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });
    }
  });

  // Add new menu type
  addNewMenuTypeButton.addEventListener('click', async () => {
    const newMenuType = newMenuTypeInput.value.trim();
    if (newMenuType) {
      const response = await addNewMenuType(newMenuType, section);
      const option = document.createElement('option');
      option.value = response.id;
      option.textContent = newMenuType;
      menuTypeDropdown.appendChild(option);

      const listItem = createMenuListItem(newMenuType, response.id);
      menuTypeList.appendChild(listItem);
      menuTypes.push({ id: response.id, name: newMenuType });

      newMenuTypeInput.value = '';
    }
  });

  // Attach to form submission to include menu type data
  const form = formContainer.querySelector(`#business-form`);
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const menuTypesInput = document.createElement('input');
      menuTypesInput.type = 'hidden';
      menuTypesInput.name = `menuTypes-${section}`;
      menuTypesInput.value = JSON.stringify(menuTypes);
      form.appendChild(menuTypesInput);

      form.submit(); // Submit the form after appending the hidden input
    });
  } else {
    console.error('Form not found in the form container');
  }

  // Helper function to create list items with a remove button
  function createMenuListItem(name, id) {
    const listItem = document.createElement('li');
    listItem.textContent = `${name}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.style.color = 'red';
    removeButton.style.marginLeft = '10px';
    removeButton.addEventListener('click', () => {
      menuTypeList.removeChild(listItem);
      const index = menuTypes.findIndex(type => type.id === id);
      if (index > -1) {
        menuTypes.splice(index, 1);
      }
    });
    listItem.appendChild(removeButton);
    return listItem;
  }
};
