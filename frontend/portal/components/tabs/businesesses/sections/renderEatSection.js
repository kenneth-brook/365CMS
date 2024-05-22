// /components/tabs/businesses/sections/renderEatSection.js

export const renderEatSection = () => {
    return `
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
    `;
};
  