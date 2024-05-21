// /components/tabs/businesses/sections/renderStaySection.js

export const renderStaySection = () => {
    return `
      <h3>Stay</h3>
      <input type="hidden" name="additionalSectionId[]" value="stay">
      <label for="accommodationType">Accommodation Type</label>
      <input type="text" name="accommodationType[]">
    `;
  };
  