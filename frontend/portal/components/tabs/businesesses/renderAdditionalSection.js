import { renderCommonSections, attachCommonHandlers } from './sections/renderCommonSections.js';
import { renderEatUniqueSection, attachEatSectionHandlers } from './sections/renderEatUniqueSection.js';
// Import other unique sections as needed

export const renderAdditionalSection = (sectionId) => {
  const uniqueId = `description-${Date.now()}`; // Generate a unique ID
  const dayHoursArray = []; // Array to store the day and hours pairs

  let uniqueSectionHtml = '';
  let attachHandlers = null;

  switch (sectionId) {
    case 'eat':
      uniqueSectionHtml = renderEatUniqueSection();
      attachHandlers = attachEatSectionHandlers;
      break;
    case 'stay':
      uniqueSectionHtml = '';
      break;
    case 'play':
      uniqueSectionHtml = '';
      break;
    case 'shop':
      uniqueSectionHtml = '';
      break;
    case 'other':
      uniqueSectionHtml = '';
      break;
    // Add cases for other sections (stay, play, shop, other) as needed
    default:
      uniqueSectionHtml = '';
  }

  const sectionHtml = `
    ${uniqueSectionHtml}
    ${renderCommonSections(uniqueId)}
  `;

  const attachAllHandlers = () => {
    const formContainer = document.querySelector('.additional-sections');
    if (formContainer) {
      console.log('Attaching all handlers...');
      if (attachHandlers) {
        attachHandlers(formContainer);
      }
      attachCommonHandlers(formContainer, uniqueId, dayHoursArray);
    } else {
      console.error('Form container not found');
    }
  };

  return {
    sectionHtml,
    attachHandlers: attachAllHandlers,
    dayHoursArray, // Return the array for database storage
  };
};
