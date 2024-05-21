// /components/tabs/businesses/sections/renderOtherSection.js

export const renderOtherSection = () => {
    return `
      <p>Only fill out the fields below if they differ from the main form.</p>
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
      <div class="form-group">
        <label for="otherType">Other Type</label>
        <input type="text" id="otherType" name="otherType">
      </div>
    `;
  };
  