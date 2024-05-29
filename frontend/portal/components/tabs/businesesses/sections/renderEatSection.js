import { renderSocialMediaSection, attachSocialMediaHandlers } from './renderSocialMediaSection.js';
import { renderLogoUploadSection, attachLogoUploadHandler } from './renderLogoUploadSection.js';
import { renderImageUploadSection, attachImageUploadHandler } from './renderImageUploadSection.js';
import { renderDescriptionSection, initializeTinyMCE } from './renderDescriptionSection.js';
import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js'

export const renderEatSection = () => {
  const newId = `description-${Date.now()}`; // Generate a unique ID
  const eatSectionHtml = `
    <div class="form-section">
      <div style="width: 100%" class="form-message">
        <p style="text-align: center; font-weight: bold;">Only fill out the fields below if they differ from the main form.</p>
      </div>
      <div class="form-group">
        <label for="eatBusinessName">Business Name</label>
        <input type="text" id="eatBusinessName" name="eatBusinessName">
      </div>
      <div class="form-group">
        <label for="eatPhone">Phone</label>
        <input type="text" id="eatPhone" name="eatPhone">
      </div>
      <div class="form-group">
        <label for="eatEmail">Email</label>
        <input type="email" id="eatEmail" name="eatEmail">
      </div>
      <div class="form-group">
        <label for="eatWeb">Web</label>
        <input type="url" id="eatWeb" name="eatWeb">
      </div>
    </div>
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
    ${renderMenuSelectionSection()}
    ${renderSocialMediaSection()}
    ${renderLogoUploadSection()}
    ${renderImageUploadSection()}
    ${renderDescriptionSection(newId)}
    <div id="saveButtonContainer" class="form-section">
      <button type="submit" id="saveBusinessButton">Save Business</button>
    </div>
  `;
  
  // Initialize TinyMCE for the new text area
  setTimeout(() => {
    initializeTinyMCE(`#${newId}`);
  }, 0);

  return eatSectionHtml;
};
