export const renderSpecialDaySection = (id) => {
    return `
      <div class="form-section special-day-section">
        <div class="special-day-container">
          <label for="special-day-${id}">Special Day:</label>
          <input type="text" id="special-day-${id}" class="special-day" name="special-day-${id}" />
        </div>
        <div class="altered-hours-container">
          <label for="altered-hours-${id}">Altered Hours:</label>
          <input type="text" id="altered-hours-${id}" class="altered-hours" name="altered-hours-${id}" />
        </div>
        <div class="add-day-container">
          <button type="button" id="add-day-button-${id}">Add Day</button>
        </div>
        <div class="day-hours-list" id="day-hours-list-${id}"></div>
      </div>
    `;
  };
  
  export const attachSpecialDayHandlers = (id, dayHoursArray) => {
    const addButton = document.getElementById(`add-day-button-${id}`);
    const dayInput = document.getElementById(`special-day-${id}`);
    const hoursInput = document.getElementById(`altered-hours-${id}`);
    const listContainer = document.getElementById(`day-hours-list-${id}`);
  
    addButton.addEventListener('click', () => {
      const day = dayInput.value.trim();
      const hours = hoursInput.value.trim();
  
      if (day && hours) {
        const listItem = document.createElement('div');
        listItem.className = 'day-hours-item';
        listItem.textContent = `${day}: ${hours}`;
        listContainer.appendChild(listItem);
  
        dayHoursArray.push({ day, hours });
  
        // Clear inputs
        dayInput.value = '';
        hoursInput.value = '';
      }
    });
  };
  