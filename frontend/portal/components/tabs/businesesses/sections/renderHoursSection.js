export const renderHoursSection = () => {
    return `
      <div class="form-section">
        <h3>Operational Hours</h3>
        <table class="hours-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td><input type="text" id="hours-monday" name="hours-monday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td><input type="text" id="hours-tuesday" name="hours-tuesday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td><input type="text" id="hours-wednesday" name="hours-wednesday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td><input type="text" id="hours-thursday" name="hours-thursday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Friday</td>
              <td><input type="text" id="hours-friday" name="hours-friday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td><input type="text" id="hours-saturday" name="hours-saturday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td><input type="text" id="hours-sunday" name="hours-sunday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  