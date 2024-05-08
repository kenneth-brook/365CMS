function getBusinessForm() {
    return `
        <form id="business-form">
            <div class="form-group">
                <label for="businessName">Business Name:</label>
                <input type="text" id="businessName" name="businessName">
            </div>
            <div class="form-group">
                <label for="businessType">Business Type:</label>
                <input type="text" id="businessType" name="businessType">
            </div>
            <div class="form-group">
                <label for="businessLocation">Location:</label>
                <input type="text" id="businessLocation" name="businessLocation">
            </div>
            <button type="submit">Save Business</button>
        </form>
    `;
}