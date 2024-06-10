export const renderSpecialDaySection = (id) => {
    return `
      <div class="form-section special-day-section">
        <div class="special-day-container">
          <label for="special-day">Special Day:</label>
          <input type="text" id="special-day" class="special-day" name="special-day" />
        </div>
        <div class="altered-hours-container">
          <label for="altered-hours">Altered Hours:</label>
          <input type="text" id="altered-hours" class="altered-hours" name="altered-hours" />
        </div>
        <div class="add-day-container">
          <button type="button" id="add-day-button">Add Day</button>
        </div>
        <div class="day-hours-list" id="day-hours-list"></div>
      </div>
    `;
  };
  
  export const attachSpecialDayHandlers = (id, dayHoursArray) => {
    const addButton = document.getElementById(`add-day-button`);
    const dayInput = document.getElementById(`special-day`);
    const hoursInput = document.getElementById(`altered-hours`);
    const listContainer = document.getElementById(`day-hours-list`);
  
    if (!addButton || !dayInput || !hoursInput || !listContainer) {
      console.error('One or more elements not found for Special Day handlers');
      return;
    }
  
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
  
  