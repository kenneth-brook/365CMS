import { renderCommonSections, attachCommonHandlers } from './sections/renderCommonSections.js';
import { renderEatUniqueSection, attachEatSectionHandlers } from './sections/renderEatUniqueSection.js';
// Import other unique sections as needed

export const renderAdditionalSection = (sectionId, uniqueId) => {
  const dayHoursArray = []; // Array to store the day and hours pairs

  let uniqueSectionHtml = '';
  let attachHandlers = null;

  switch (sectionId) {
    case 'eat':
      uniqueSectionHtml = renderEatUniqueSection(uniqueId); // Pass uniqueId
      attachHandlers = attachEatSectionHandlers;
      break;
    case 'stay':
      uniqueSectionHtml = ''; // Implement as needed
      break;
    case 'play':
      uniqueSectionHtml = ''; // Implement as needed
      break;
    case 'shop':
      uniqueSectionHtml = ''; // Implement as needed
      break;
    case 'other':
      uniqueSectionHtml = ''; // Implement as needed
      break;
    default:
      uniqueSectionHtml = '';
  }

  const sectionHtml = `
    ${uniqueSectionHtml}
    ${renderCommonSections(uniqueId)} <!-- Pass uniqueId -->
  `;

  const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const intervalTime = 100;
      let timeElapsed = 0;

      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        } else {
          timeElapsed += intervalTime;
          if (timeElapsed >= timeout) {
            clearInterval(interval);
            reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
          }
        }
      }, intervalTime);
    });
  };

  const attachAllHandlers = async () => {
    try {
      const formContainer = await waitForElement(`.additional-section[data-id="${uniqueId}"]`);
      console.log('Attaching all handlers...');
      if (attachHandlers) {
        attachHandlers(formContainer, uniqueId); // Pass uniqueId
      }
      attachCommonHandlers(formContainer, uniqueId, dayHoursArray);
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    sectionHtml,
    attachHandlers: attachAllHandlers,
    dayHoursArray, // Return the array for database storage
  };
};
