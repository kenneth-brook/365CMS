// /components/tabs/businesses/sections/renderShopSection.js

export const renderShopSection = () => {
    return `
      <h3>Shop</h3>
      <input type="hidden" name="additionalSectionId[]" value="shop">
      <label for="shopType">Shop Type</label>
      <input type="text" name="shopType[]">
    `;
  };
  