import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderEatUniqueSection = () => {
  const labels = {
    menuTypeLabel: 'Menu Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: 'Average Cost',
    showAverageCost: true
  };

  return `
    <div class="form-section">
      <div style="width: 100%" class="form-message">
        <p style="text-align: center; font-weight: bold;">Select menu availability and hours of operation.</p>
      </div>
      <div class="form-group-container" style="display: flex; justify-content: space-around; width: 100%; margin: 0 auto;">
        <div class="form-group" style="text-align: center; width: 45%;">
          <p style="text-align: center;">Select the operation day/time model.</p>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <label style="white-space: nowrap;">
              <input type="checkbox" name="operationModel" value="24/7" onclick="selectOnlyThis(this, 'operationModel', showDaySelection)">
              24/7
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="operationModel" value="7Days/SelectHours" onclick="selectOnlyThis(this, 'operationModel', showDaySelection)">
              7Days/Select Hours
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="operationModel" value="SelectDays/SelectHours" onclick="selectOnlyThis(this, 'operationModel', showDaySelection)">
              Select Days/Select Hours
            </label>
          </div>
          <div id="daySelectionContainer" style="display: none; margin-top: 20px;">
            <p style="text-align: center;">Select days open.</p>
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
              <label><input type="checkbox" name="daysOpen" value="Sun" onclick="updateTable()"> Sun</label>
              <label><input type="checkbox" name="daysOpen" value="Mon" onclick="updateTable()"> Mon</label>
              <label><input type="checkbox" name="daysOpen" value="Tues" onclick="updateTable()"> Tues</label>
              <label><input type="checkbox" name="daysOpen" value="Wed" onclick="updateTable()"> Wed</label>
              <label><input type="checkbox" name="daysOpen" value="Thur" onclick="updateTable()"> Thur</label>
              <label><input type="checkbox" name="daysOpen" value="Fri" onclick="updateTable()"> Fri</label>
              <label><input type="checkbox" name="daysOpen" value="Sat" onclick="updateTable()"> Sat</label>
            </div>
          </div>
        </div>
        <div class="form-group" style="text-align: center; width: 45%;">
          <p style="text-align: center;">Select your menu style.</p>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <label style="white-space: nowrap;">
              <input type="checkbox" name="menuStyle" value="OneMenu" onclick="selectOnlyThis(this, 'menuStyle', showMenuSelection)">
              One Menu
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="menuStyle" value="MultipleMenus" onclick="selectOnlyThis(this, 'menuStyle', showMenuSelection)">
              Multiple Menus
            </label>
          </div>
          <div id="menuSelectionContainer" style="display: none; margin-top: 20px;">
            <p style="text-align: center;">Select your menus.</p>
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
              <label><input type="checkbox" name="menuType" value="Breakfast" onclick="updateTable()"> Breakfast</label>
              <label><input type="checkbox" name="menuType" value="Lunch" onclick="updateTable()"> Lunch</label>
              <label><input type="checkbox" name="menuType" value="Dinner" onclick="updateTable()"> Dinner</label>
            </div>
          </div>
        </div>
        <div id="scheduleTableContainer" style="margin-top: 20px; display: none;">
          <table id="scheduleTable" border="1" style="width: 100%; text-align: center;">
            <thead>
              <tr id="scheduleTableHeader"></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
    ${renderMenuSelectionSection('eat', labels)}
  `;
};

export const attachEatSectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Eat Section handlers');
    return;
  }

  const operationModelCheckboxes = formContainer.querySelectorAll('input[name="operationModel"]');
  const menuStyleCheckboxes = formContainer.querySelectorAll('input[name="menuStyle"]');

  console.log('Attaching handlers for Eat Section:');
  console.log('operationModelCheckboxes:', operationModelCheckboxes);
  console.log('menuStyleCheckboxes:', menuStyleCheckboxes);

  if (operationModelCheckboxes.length > 0) {
    operationModelCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', () => selectOnlyThis(checkbox, 'operationModel', showDaySelection));
    });
  } else {
    console.error('Operation model checkboxes not found');
  }

  if (menuStyleCheckboxes.length > 0) {
    menuStyleCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', () => selectOnlyThis(checkbox, 'menuStyle', showMenuSelection));
    });
  } else {
    console.error('Menu style checkboxes not found');
  }

  console.log('Calling attachMenuSelectionHandlers for section: eat');
  await attachMenuSelectionHandlers(formContainer, 'eat');
  console.log('Finished calling attachMenuSelectionHandlers for section: eat');
};

const showDaySelection = (checkbox) => {
  const container = checkbox.closest('.form-group-container');
  const daySelectionContainer = container.querySelector('#daySelectionContainer');
  console.log('showDaySelection:', daySelectionContainer);
  if (daySelectionContainer) {
    if (checkbox.value !== '24/7') {
      daySelectionContainer.style.display = 'block';
    } else {
      daySelectionContainer.style.display = 'none';
    }
  } else {
    console.error('Day selection container not found');
  }
};

const showMenuSelection = (checkbox) => {
  const container = checkbox.closest('.form-group-container');
  const menuSelectionContainer = container.querySelector('#menuSelectionContainer');
  console.log('showMenuSelection:', menuSelectionContainer);
  if (menuSelectionContainer) {
    if (checkbox.value === 'MultipleMenus') {
      menuSelectionContainer.style.display = 'block';
    } else {
      menuSelectionContainer.style.display = 'none';
    }
  } else {
    console.error('Menu selection container not found');
  }
};

window.updateTable = function() {
  const operationModel = document.querySelector('input[name="operationModel"]:checked');
  const menuStyle = document.querySelector('input[name="menuStyle"]:checked');
  const daysOpen = Array.from(document.querySelectorAll('input[name="daysOpen"]:checked')).map(cb => cb.value);
  const menuTypes = Array.from(document.querySelectorAll('input[name="menuType"]:checked')).map(cb => cb.value);

  const tableContainer = document.getElementById('scheduleTableContainer');
  const tableHeader = document.getElementById('scheduleTableHeader');
  const tableBody = document.querySelector('#scheduleTable tbody');
  tableBody.innerHTML = ''; // Clear existing table rows

  if (!operationModel || !menuStyle || (menuStyle.value === 'MultipleMenus' && menuTypes.length === 0)) {
    tableContainer.style.display = 'none';
    return;
  }

  tableContainer.style.display = 'block';

  const days = operationModel.value === '7Days/SelectHours' ? ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'] : daysOpen;

  // Create table header
  tableHeader.innerHTML = '<th>Day/Menu</th>';
  if (menuStyle.value === 'MultipleMenus') {
    menuTypes.forEach(menu => {
      const th = document.createElement('th');
      th.textContent = menu;
      tableHeader.appendChild(th);
    });
  } else {
    const th = document.createElement('th');
    th.textContent = 'Hours Open';
    tableHeader.appendChild(th);
  }

  // Create table rows
  days.forEach(day => {
    const row = document.createElement('tr');
    const dayCell = document.createElement('td');
    dayCell.textContent = day;
    row.appendChild(dayCell);

    if (menuStyle.value === 'MultipleMenus') {
      menuTypes.forEach(() => {
        const inputCell = document.createElement('td');
        inputCell.innerHTML = '<input type="text" name="hoursOpen">';
        row.appendChild(inputCell);
      });
    } else {
      const inputCell = document.createElement('td');
      inputCell.innerHTML = '<input type="text" name="hoursOpen">';
      row.appendChild(inputCell);
    }

    tableBody.appendChild(row);
  });
};

// Expose these functions to the global scope if needed
window.showDaySelection = showDaySelection;
window.showMenuSelection = showMenuSelection;
