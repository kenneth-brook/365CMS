import { renderHoursSection } from './renderHoursSection.js';
import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderShopUniqueSection = () => {
  const labels = {
    menuTypeLabel: 'Shopping Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: '',
    showAverageCost: false
  };

  return `
    ${renderHoursSection()}
    ${renderMenuSelectionSection('shop', labels)}
  `;
};
  
export const attachShopSectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Shop Section handlers');
    return;
  }

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer, 'shop');

  // You can add more handlers here if needed, e.g., for the hours section
};