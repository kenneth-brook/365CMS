// /components/tabs/businesses/sections/renderAdditionalSection.js

import { renderEatSection } from './sections/renderEatSection.js';
import { renderStaySection } from './sections/renderStaySection.js';
import { renderPlaySection } from './sections/renderPlaySection.js';
import { renderShopSection } from './sections/renderShopSection.js';
import { renderOtherSection } from './sections/renderOtherSection.js';

export const renderAdditionalSection = (sectionId) => {
  console.log(sectionId)
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
};
