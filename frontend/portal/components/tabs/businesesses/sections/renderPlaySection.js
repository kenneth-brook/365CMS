// /components/tabs/businesses/sections/renderPlaySection.js

export const renderPlaySection = () => {
    return `
      <p>Only fill out the fields below if they differ from the main form.</p>
      <div class="form-group">
        <label for="playBusinessName">Business Name</label>
        <input type="text" id="playBusinessName" name="playBusinessName">
      </div>
      <div class="form-group">
        <label for="playPhone">Phone</label>
        <input type="text" id="playPhone" name="playPhone">
      </div>
      <div class="form-group">
        <label for="playEmail">Email</label>
        <input type="email" id="playEmail" name="playEmail">
      </div>
      <div class="form-group">
        <label for="playWeb">Web</label>
        <input type="url" id="playWeb" name="playWeb">
      </div>
      <div class="form-group">
        <label for="activityType">Activity Type</label>
        <input type="text" id="activityType" name="activityType">
      </div>
    `;
  };
  