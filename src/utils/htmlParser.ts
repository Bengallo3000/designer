import { Element } from '../types/Element';

export const parseHTMLToElements = (html: string): Element[] => {
  const elements: Element[] = [];
  
  try {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let yOffset = 50;
    let zIndex = 1;

    // Extract buttons
    const buttons = tempDiv.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const computedStyle = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      elements.push({
        id: `imported-button-${Date.now()}-${index}`,
        type: 'button',
        x: 200 + (index * 20),
        y: yOffset,
        width: Math.max(rect.width, 120),
        height: Math.max(rect.height, 40),
        text: button.textContent || 'Button',
        color: '#ffffff',
        backgroundColor: computedStyle.backgroundColor || '#ff00ff',
        rotation: 0,
        opacity: 1,
        borderRadius: 4,
        fontSize: parseInt(computedStyle.fontSize) || 14,
        fontWeight: computedStyle.fontWeight || 'normal',
        borderStyle: 'solid',
        borderColor: computedStyle.borderColor || '#00ffff',
        borderWidth: parseInt(computedStyle.borderWidth) || 1,
        zIndex: zIndex++,
      });
      yOffset += 60;
    });

    // Extract inputs
    const inputs = tempDiv.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"]');
    inputs.forEach((input, index) => {
      const computedStyle = window.getComputedStyle(input);
      const rect = input.getBoundingClientRect();
      
      elements.push({
        id: `imported-input-${Date.now()}-${index}`,
        type: 'input',
        x: 200 + (index * 20),
        y: yOffset,
        width: Math.max(rect.width, 200),
        height: Math.max(rect.height, 40),
        text: input.placeholder || input.value || 'Input field',
        color: '#ffffff',
        backgroundColor: computedStyle.backgroundColor || '#0a0a0a',
        rotation: 0,
        opacity: 1,
        borderRadius: 4,
        fontSize: parseInt(computedStyle.fontSize) || 14,
        fontWeight: computedStyle.fontWeight || 'normal',
        borderStyle: 'solid',
        borderColor: computedStyle.borderColor || '#00ffff',
        borderWidth: parseInt(computedStyle.borderWidth) || 1,
        zIndex: zIndex++,
      });
      yOffset += 60;
    });

    // Extract text elements (headings, paragraphs)
    const textElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    textElements.forEach((element, index) => {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        const computedStyle = window.getComputedStyle(element);
        const tagName = element.tagName.toLowerCase();
        let fontSize = 16;
        
        // Set font sizes based on tag
        switch (tagName) {
          case 'h1': fontSize = 32; break;
          case 'h2': fontSize = 24; break;
          case 'h3': fontSize = 20; break;
          case 'h4': fontSize = 18; break;
          case 'h5': fontSize = 16; break;
          case 'h6': fontSize = 14; break;
          default: fontSize = parseInt(computedStyle.fontSize) || 16;
        }
        
        const rect = element.getBoundingClientRect();
        
        elements.push({
          id: `imported-text-${Date.now()}-${index}`,
          type: 'text',
          x: 200 + (index * 20),
          y: yOffset,
          width: Math.max(rect.width, 250),
          height: Math.max(rect.height, 30),
          text: text,
          color: computedStyle.color || '#00ffff',
          backgroundColor: 'transparent',
          rotation: 0,
          opacity: 1,
          borderRadius: 0,
          fontSize: fontSize,
          fontWeight: computedStyle.fontWeight || 'normal',
          borderStyle: 'none',
          borderColor: 'transparent',
          borderWidth: 0,
          zIndex: zIndex++,
        });
        yOffset += 50;
      }
    });

    // Extract images
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      
      elements.push({
        id: `imported-image-${Date.now()}-${index}`,
        type: 'image',
        x: 200 + (index * 20),
        y: yOffset,
        width: Math.max(rect.width, 100),
        height: Math.max(rect.height, 100),
        text: img.alt || '🖼️ Image',
        color: '#ffffff',
        backgroundColor: '#374151',
        rotation: 0,
        opacity: 1,
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 'normal',
        borderStyle: 'solid',
        borderColor: '#00ffff',
        borderWidth: 1,
        zIndex: zIndex++,
      });
      yOffset += 120;
    });

    // Extract links as buttons
    const links = tempDiv.querySelectorAll('a');
    links.forEach((link, index) => {
      const text = link.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        const computedStyle = window.getComputedStyle(link);
        
        elements.push({
          id: `imported-link-${Date.now()}-${index}`,
          type: 'button',
          x: 200 + (index * 20),
          y: yOffset,
          width: 150,
          height: 40,
          text: text,
          color: computedStyle.color || '#00ffff',
          backgroundColor: 'transparent',
          rotation: 0,
          opacity: 1,
          borderRadius: 4,
          fontSize: parseInt(computedStyle.fontSize) || 14,
          fontWeight: computedStyle.fontWeight || 'normal',
          borderStyle: 'solid',
          borderColor: computedStyle.color || '#00ffff',
          borderWidth: 1,
          zIndex: zIndex++,
        });
        yOffset += 60;
      }
    });

    // Extract forms
    const forms = tempDiv.querySelectorAll('form');
    forms.forEach((form, index) => {
      const rect = form.getBoundingClientRect();
      
      elements.push({
        id: `imported-form-${Date.now()}-${index}`,
        type: 'text',
        x: 200 + (index * 20),
        y: yOffset,
        width: Math.max(rect.width, 300),
        height: Math.max(rect.height, 200),
        text: '📋 Form Container',
        color: '#ffffff',
        backgroundColor: '#1a1a2e',
        rotation: 0,
        opacity: 1,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 'normal',
        borderStyle: 'solid',
        borderColor: '#00ffff',
        borderWidth: 2,
        zIndex: zIndex++,
      });
      yOffset += 220;
    });

  } catch (error) {
    console.error('Error parsing HTML:', error);
  }

  return elements;
};