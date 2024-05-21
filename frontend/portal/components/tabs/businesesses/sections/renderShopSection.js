// /components/tabs/businesses/sections/renderShopSection.js

export const renderShopSection = () => {
    return `
      <p>Only fill out the fields below if they differ from the main form.</p>
      <div class="form-group">
        <label for="shopBusinessName">Business Name</label>
        <input type="text" id="shopBusinessName" name="shopBusinessName">
      </div>
      <div class="form-group">
        <label for="shopPhone">Phone</label>
        <input type="text" id="shopPhone" name="shopPhone">
      </div>
      <div class="form-group">
        <label for="shopEmail">Email</label>
        <input type="email" id="shopEmail" name="shopEmail">
      </div>
      <div class="form-group">
        <label for="shopWeb">Web</label>
        <input type="url" id="shopWeb" name="shopWeb">
      </div>
      <div class="form-group">
        <label for="shopType">Shop Type</label>
        <input type="text" id="shopType" name="shopType">
      </div>
    `;
  };
  