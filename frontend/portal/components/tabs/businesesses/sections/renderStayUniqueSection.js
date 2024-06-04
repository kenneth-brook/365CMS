import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderStayUniqueSection = () => {
  const labels = {
    menuTypeLabel: 'Room Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: 'Average Cost',
    showAverageCost: true
  };

  return `
    ${renderMenuSelectionSection('stay', labels)}
  `;
};

export const attachStaySectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Stay Section handlers');
    return;
  }

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer, 'stay');

  // Add any specific handlers for the stay section if needed
  // Currently, there are no additional handlers for the "stay" section
};
