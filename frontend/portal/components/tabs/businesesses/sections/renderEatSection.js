// /components/tabs/businesses/sections/renderEatSection.js

export const renderEatSection = () => {
    return `
      <h3>Eat</h3>
      <input type="hidden" name="additionalSectionId[]" value="eat">
      <label for="cuisineType">Cuisine Type</label>
      <input type="text" name="cuisineType[]">
    `;
  };
  