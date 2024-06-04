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
  