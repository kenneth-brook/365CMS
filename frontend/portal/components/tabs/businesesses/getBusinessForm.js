export const getBusinessForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <form id="business-form">
        <div class="form-section">
          <div class="form-toggle">
            <label id="toggle-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
            <input type="checkbox" id="active-toggle" name="active">
          </div>
        </div>
        ${renderAddressSection()}
        ${renderCoordinatesSection()}
        <button type="submit">Save Business</button>
      </form>
    `;
    return formContainer;
  };
  
  const renderAddressSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="businessName">Business Name:</label>
          <input type="text" id="businessName" name="businessName">
        </div>
        <div class="form-group">
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress">
        </div>
        <div class="form-group">
          <label for="mailingAddress">Mailing Address:</label>
          <input type="text" id="mailingAddress" name="mailingAddress">
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" name="city">
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" name="state">
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" name="zipCode">
        </div>
      </div>
    `;
  };
  
  const renderCoordinatesSection = () => {
    return `
      <div class="form-section">
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="text" id="latitude" name="latitude" readonly>
        </div>
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="text" id="longitude" name="longitude" readonly>
        </div>
        <button type="button" id="autofill-button">Auto Fill</button>
      </div>
    `;
  };
  