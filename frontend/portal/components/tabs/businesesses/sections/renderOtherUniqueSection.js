import { renderHoursSection } from './renderHoursSection.js';
import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderOtherUniqueSection = () => {
  const labels = {
    menuTypeLabel: 'Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: '',
    showAverageCost: false
  };

  return `
    ${renderHoursSection()}
    ${renderMenuSelectionSection('other', labels)}
  `;
};

export const attachOtherSectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Other Section handlers');
    return;
  }

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer, 'other');

  // Add any specific handlers for the hours section if needed
  // Currently, there are no additional handlers for the "other" section
};

  