// /components/tabs/businesses/sections/renderOtherSection.js

export const renderOtherSection = () => {
    return `
      <h3>Other</h3>
      <input type="hidden" name="additionalSectionId[]" value="other">
      <label for="otherType">Other Type</label>
      <input type="text" name="otherType[]">
    `;
  };
  