// /components/tabs/businesses/sections/renderStaySection.js

export const renderStaySection = () => {
    return `
      <p>Only fill out the fields below if they differ from the main form.</p>
      <div class="form-group">
        <label for="stayBusinessName">Business Name</label>
        <input type="text" id="stayBusinessName" name="stayBusinessName">
      </div>
      <div class="form-group">
        <label for="stayPhone">Phone</label>
        <input type="text" id="stayPhone" name="stayPhone">
      </div>
      <div class="form-group">
        <label for="stayEmail">Email</label>
        <input type="email" id="stayEmail" name="stayEmail">
      </div>
      <div class="form-group">
        <label for="stayWeb">Web</label>
        <input type="url" id="stayWeb" name="stayWeb">
      </div>
      <div class="form-group">
        <label for="roomType">Room Type</label>
        <input type="text" id="roomType" name="roomType">
      </div>
    `;
  };
  