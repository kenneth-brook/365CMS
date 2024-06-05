import { renderHoursSection } from './renderHoursSection.js';
import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderShopUniqueSection = () => {
  console.log('Rendering Shop Unique Section');
  const labels = {
    menuTypeLabel: 'Shopping Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: '',
    showAverageCost: false
  };

  const sectionHtml = `
    ${renderHoursSection()}
    ${renderMenuSelectionSection('shop', labels)}
  `;
  
  console.log('Rendered Shop Unique Section HTML:', sectionHtml);
  return sectionHtml;
};

export const attachShopSectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Shop Section handlers');
    return;
  }

  console.log('Attaching handlers for Shop Section');
  console.log('Form container:', formContainer);

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer, 'shop');
  console.log('Finished attaching handlers for Shop Section');

  // You can add more handlers here if needed, e.g., for the hours section
};
