// /components/tabs/businesses/sections/renderOtherSection.js

export const renderOtherSection = () => {
    return `
    <div style="width: 100%" class="form-message">
    <p style="text-align: center; font-weight: bold;">Only fill out the fields below if they differ from the main form.</p>
  </div>
      <div class="form-group">
        <label for="otherBusinessName">Business Name</label>
        <input type="text" id="otherBusinessName" name="otherBusinessName">
      </div>
      <div class="form-group">
        <label for="otherPhone">Phone</label>
        <input type="text" id="otherPhone" name="otherPhone">
      </div>
      <div class="form-group">
        <label for="otherEmail">Email</label>
        <input type="email" id="otherEmail" name="otherEmail">
      </div>
      <div class="form-group">
        <label for="otherWeb">Web</label>
        <input type="url" id="otherWeb" name="otherWeb">
      </div>
    `;
  };
  