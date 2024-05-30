// /components/tabs/businesses/sections/renderAdditionalSection.js

/*import { renderEatSection } from './sections/renderEatSection.js';
import { renderStaySection } from './sections/renderStaySection.js';
import { renderPlaySection } from './sections/renderPlaySection.js';
import { renderShopSection } from './sections/renderShopSection.js';
import { renderOtherSection } from './sections/renderOtherSection.js';

export const renderAdditionalSection = (sectionId) => {
  switch (sectionId) {
    case 'eat':
      return renderEatSection();
    case 'stay':
      return renderStaySection();
    case 'play':
      return renderPlaySection();
    case 'shop':
      return renderShopSection();
    case 'other':
      return renderOtherSection();
    default:
      return '';
  }
};*/

import { renderCommonSections } from './sections/renderCommonSections.js';
import { renderEatUniqueSection, attachEatSectionHandlers } from './sections/renderEatUniqueSection.js';
// Import other unique sections as needed

export const renderAdditionalSection = (sectionId) => {
  const uniqueId = `description-${Date.now()}`; // Generate a unique ID

  let uniqueSectionHtml = '';
  let attachHandlers = null;

  switch (sectionId) {
    case 'eat':
      uniqueSectionHtml = renderEatUniqueSection();
      attachHandlers = attachEatSectionHandlers;
      break;
    // Add cases for other sections (stay, play, shop, other) as needed
    default:
      uniqueSectionHtml = '';
  }

  const sectionHtml = `
    ${uniqueSectionHtml}
    ${renderCommonSections(uniqueId)}
  `;

  return {
    sectionHtml,
    attachHandlers,
  };
};
