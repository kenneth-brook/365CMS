// /components/tabs/businesses/sections/renderPlaySection.js

export const renderPlaySection = () => {
    return `
      <h3>Play</h3>
      <input type="hidden" name="additionalSectionId[]" value="play">
      <label for="activityType">Activity Type</label>
      <input type="text" name="activityType[]">
    `;
  };
  