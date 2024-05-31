const getMenuTypes = async () => {
  // Fetch menu types from your API
  return [
    { id: 1, name: 'Breakfast' },
    { id: 2, name: 'Lunch' },
    { id: 3, name: 'Dinner' }
  ];
};

const getAverageCosts = async () => {
  // Fetch average costs from your API
  return [
    { id: 1, name: '$' },
    { id: 2, name: '$$' },
    { id: 3, name: '$$$' }
  ];
};

const addNewMenuType = async (newMenuType) => {
  // Add new menu type to your API and return the new type
  // This is a mock function, replace it with your actual API call
  return { id: Date.now(), name: newMenuType };
};

export const renderMenuSelectionSection = () => {
  return `
    <div class="form-section" id="menu-selection-section">
      <div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">
        <div class="form-group">
          <label for="menuType">Menu Type:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <select id="menuType" name="menuType"></select>
            <button type="button" id="add-menu-type">Add Selection</button>
          </div>
        </div>
        <div class="form-group">
          <label for="newMenuType">Add New Selection:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="newMenuType" name="newMenuType">
            <button type="button" id="add-new-menu-type">Add</button>
          </div>
        </div>
        <div class="form-group">
          <label for="averageCost">Average Cost:</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <select id="averageCost" name="averageCost"></select>
          </div>
        </div>
      </div>
      <ul id="menu-type-list"></ul>
    </div>
  `;
};

export const attachMenuSelectionHandlers = async (formContainer) => {
  const menuTypeDropdown = formContainer.querySelector('#menuType');
  const averageCostDropdown = formContainer.querySelector('#averageCost');
  const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
  const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
  const newMenuTypeInput = formContainer.querySelector('#newMenuType');
  const menuTypeList = formContainer.querySelector('#menu-type-list');

  if (!menuTypeDropdown || !averageCostDropdown || !addMenuTypeButton || !addNewMenuTypeButton || !newMenuTypeInput || !menuTypeList) {
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
  const fetchedMenuTypes = await getMenuTypes();
  fetchedMenuTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    menuTypeDropdown.appendChild(option);
  });

  const fetchedAverageCosts = await getAverageCosts();
  fetchedAverageCosts.forEach(cost => {
    const option = document.createElement('option');
    option.value = cost.id;
    option.textContent = cost.name;
    averageCostDropdown.appendChild(option);
  });

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
      const response = await addNewMenuType(newMenuType);
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
  const form = formContainer.querySelector('#business-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const menuTypesInput = document.createElement('input');
      menuTypesInput.type = 'hidden';
      menuTypesInput.name = 'menuTypes';
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
