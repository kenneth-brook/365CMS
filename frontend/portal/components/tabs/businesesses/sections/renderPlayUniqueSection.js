import { renderHoursSection } from './renderHoursSection.js';
import { renderMenuSelectionSection, attachMenuSelectionHandlers } from './renderMenuSelectionSection.js';

export const renderPlayUniqueSection = () => {
  const labels = {
    menuTypeLabel: 'Activity Type',
    newMenuTypeLabel: 'Add New Selection',
    averageCostLabel: '',
    showAverageCost: false
  };

  return `
    ${renderHoursSection()}
    ${renderMenuSelectionSection('play', labels)}
  `;
};

export const attachPlaySectionHandlers = async (formContainer) => {
  if (!formContainer) {
    console.error('Form container not found for attaching Play Section handlers');
    return;
  }

  // Call attachMenuSelectionHandlers for the menu selection section
  await attachMenuSelectionHandlers(formContainer, 'play');

  // Add any specific handlers for the hours section if needed
  // Currently, there are no additional handlers for the "play" section
};