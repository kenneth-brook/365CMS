import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderEatUniqueSection = () => {
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
              <input type="checkbox" name="operationModel" value="24/7">
              24/7
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="operationModel" value="7Days/SelectHours">
              7Days/Select Hours
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="operationModel" value="SelectDays/SelectHours">
              Select Days/Select Hours
            </label>
          </div>
          <div id="daySelectionContainer" style="display: none; margin-top: 20px;">
            <p style="text-align: center;">Select days open.</p>
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
              <label><input type="checkbox" name="daysOpen" value="Sun"> Sun</label>
              <label><input type="checkbox" name="daysOpen" value="Mon"> Mon</label>
              <label><input type="checkbox" name="daysOpen" value="Tues"> Tues</label>
              <label><input type="checkbox" name="daysOpen" value="Wed"> Wed</label>
              <label><input type="checkbox" name="daysOpen" value="Thur"> Thur</label>
              <label><input type="checkbox" name="daysOpen" value="Fri"> Fri</label>
              <label><input type="checkbox" name="daysOpen" value="Sat"> Sat</label>
            </div>
          </div>
        </div>
        <div class="form-group" style="text-align: center; width: 45%;">
          <p style="text-align: center;">Select your menu style.</p>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <label style="white-space: nowrap;">
              <input type="checkbox" name="menuStyle" value="OneMenu">
              One Menu
            </label>
            <label style="white-space: nowrap;">
              <input type="checkbox" name="menuStyle" value="MultipleMenus">
              Multiple Menus
            </label>
          </div>
          <div id="menuSelectionContainer" style="display: none; margin-top: 20px;">
            <p style="text-align: center;">Select your menus.</p>
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
              <label><input type="checkbox" name="menuType" value="Breakfast"> Breakfast</label>
              <label><input type="checkbox" name="menuType" value="Lunch"> Lunch</label>
              <label><input type="checkbox" name="menuType" value="Dinner"> Dinner</label>
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
    ${renderMenuSelectionSection()}
  `;
};

export const attachEatSectionHandlers = async (formContainer) => {
  const operationModelCheckboxes = formContainer.querySelectorAll('input[name="operationModel"]');
  const menuStyleCheckboxes = formContainer.querySelectorAll('input[name="menuStyle"]');

  if (operationModelCheckboxes) {
    operationModelCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', () => selectOnlyThis(checkbox, 'operationModel', showDaySelection));
    });
  }

  if (menuStyleCheckboxes) {
    menuStyleCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', () => selectOnlyThis(checkbox, 'menuStyle', showMenuSelection));
    });
  }

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer);
};

const showDaySelection = (checkbox) => {
  const container = checkbox.closest('.form-group-container');
  const daySelectionContainer = container.querySelector('#daySelectionContainer');
  if (daySelectionContainer) {
    if (checkbox.value !== '24/7') {
      daySelectionContainer.style.display = 'block';
    } else {
      daySelectionContainer.style.display = 'none';
    }
  }
};

const showMenuSelection = (checkbox) => {
  const container = checkbox.closest('.form-group-container');
  const menuSelectionContainer = container.querySelector('#menuSelectionContainer');
  if (menuSelectionContainer) {
    if (checkbox.value === 'MultipleMenus') {
      menuSelectionContainer.style.display = 'block';
    } else {
      menuSelectionContainer.style.display = 'none';
    }
  }
};

// Expose these functions to the global scope if needed
window.showDaySelection = showDaySelection;
window.showMenuSelection = showMenuSelection;
