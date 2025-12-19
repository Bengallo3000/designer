import { Element } from '../types/Element';

export function parseHTMLToElements(htmlContent: string): Element[] {
  const elements: Element[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // SECURITY: Remove all script tags and potentially dangerous attributes
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove dangerous attributes from all elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove event handlers and dangerous attributes
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 
                           'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
                           'href', 'src', 'action', 'method', 'enctype', 'target'];
    dangerousAttrs.forEach(attr => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
    
    // Remove form-related attributes
    if (el.tagName === 'FORM' || el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
      const formAttrs = ['action', 'method', 'enctype', 'target', 'name', 'value', 'type'];
      formAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
    }
  });
  
  // Extract inline styles for visual purposes only
  const styleTags = doc.querySelectorAll('style');
  let extractedStyles: { [key: string]: CSSStyleDeclaration } = {};
  
  styleTags.forEach(styleTag => {
    const styleText = styleTag.textContent || '';
    // Parse only visual CSS properties
    const rules = styleText.match(/\.([^{]+)\s*{([^}]+)}/g) || [];
    
    rules.forEach(rule => {
      const match = rule.match(/\.([^{]+)\s*{([^}]+)}/);
      if (match) {
        const className = match[1].trim();
        const styles = match[2];
        const styleObj = {} as CSSStyleDeclaration;
        
        // Parse only safe visual style declarations
        const declarations = styles.split(';').filter(s => s.trim());
        declarations.forEach(decl => {
          const [property, value] = decl.split(':').map(s => s.trim());
          if (property && value) {
            // Only allow visual properties
            const allowedProps = [
              'color', 'background-color', 'background', 'font-size', 'font-weight',
              'font-family', 'text-align', 'line-height', 'letter-spacing',
              'border-radius', 'border-color', 'border-style', 'border-width',
              'margin', 'padding', 'width', 'height', 'opacity', 'transform',
              'box-shadow', 'text-shadow', 'display', 'position', 'left', 'top',
              'right', 'bottom', 'z-index'
            ];
            
            if (allowedProps.includes(property)) {
              styleObj[property as any] = value;
            }
          }
        });
        
        extractedStyles[className] = styleObj;
      }
    });
  });
  
  // Process body content for visual elements only
  const body = doc.body;
  const visualElements = body.querySelectorAll('*');
  
  visualElements.forEach((el, index) => {
    // Skip non-visual elements
    if (el.tagName === 'SCRIPT' || el.tagName === 'META' || el.tagName === 'STYLE' || 
        el.tagName === 'LINK' || el.tagName === 'NOSCRIPT') {
      return;
    }
    
    // Get visual positioning (simplified)
    let x = 50 + (index * 30) % 600;
    let y = 50 + Math.floor(index / 10) * 60;
    
    // Try to extract position from inline styles (visual only)
    const inlineStyle = (el.getAttribute('style') || '');
    const positionMatch = inlineStyle.match(/(?:left|margin-left):\s*(\d+)px/);
    const topMatch = inlineStyle.match(/(?:top|margin-top):\s*(\d+)px/);
    
    if (positionMatch) x = parseInt(positionMatch[1]);
    if (topMatch) y = parseInt(topMatch[1]);
    
    // Get visual dimensions
    let width = 150;
    let height = 40;
    
    const widthMatch = inlineStyle.match(/width:\s*(\d+)px/);
    const heightMatch = inlineStyle.match(/height:\s*(\d+)px/);
    
    if (widthMatch) width = parseInt(widthMatch[1]);
    if (heightMatch) height = parseInt(heightMatch[1]);
    
    // Determine visual element type (no functionality)
    let type: Element['type'] = 'text';
    let text = '';
    let color = '#ffffff';
    let backgroundColor = 'transparent';
    let fontSize = 14;
    let fontWeight = 'normal';
    let borderRadius = 0;
    let borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' = 'none';
    let borderColor = '#000000';
    let borderWidth = 0;
    
    // Extract visual text content only
    if (el.tagName === 'BUTTON') {
      type = 'button';
      text = el.textContent || 'Button';
      backgroundColor = '#00ffff';
      color = '#000000';
    } else if (el.tagName === 'INPUT') {
      type = 'input';
      // Use placeholder for visual representation, no actual input functionality
      text = el.getAttribute('placeholder') || el.getAttribute('value') || 'Input';
      backgroundColor = 'rgba(0, 0, 0, 0.5)';
      width = 200;
    } else if (el.tagName === 'IMG') {
      type = 'image';
      text = el.getAttribute('alt') || 'Image';
      width = 150;
      height = 150;
      backgroundColor = 'transparent';
    } else if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
      type = 'text';
      text = el.textContent || 'Heading';
      fontSize = el.tagName === 'H1' ? 36 : el.tagName === 'H2' ? 28 : 22;
      fontWeight = 'bold';
      backgroundColor = 'transparent';
    } else if (el.tagName === 'P' || el.tagName === 'DIV' || el.tagName === 'SPAN') {
      type = 'text';
      text = el.textContent || 'Text';
      backgroundColor = 'transparent';
    } else if (el.tagName === 'A') {
      // Convert links to text elements (remove functionality)
      type = 'text';
      text = el.textContent || 'Link';
      backgroundColor = 'transparent';
      color = '#00ffff'; // Link color for visual indication
    } else if (el.tagName === 'FORM') {
      // Convert forms to visual container
      type = 'text';
      text = 'Form Container';
      backgroundColor = 'rgba(255, 255, 255, 0.05)';
      width = 300;
      height = 200;
    } else if (el.tagName === 'SELECT') {
      type = 'input';
      text = 'Dropdown';
      backgroundColor = 'rgba(0, 0, 0, 0.5)';
      width = 200;
    } else if (el.tagName === 'TEXTAREA') {
      type = 'input';
      text = 'Text Area';
      backgroundColor = 'rgba(0, 0, 0, 0.5)';
      width = 300;
      height = 100;
    } else if (el.tagName === 'LABEL') {
      type = 'text';
      text = el.textContent || 'Label';
      backgroundColor = 'transparent';
      fontSize = 12;
    } else if (el.textContent?.includes('⏱️') || el.className?.includes('timer')) {
      type = 'timer';
      text = el.textContent || '⏱️ 00:00';
      backgroundColor = 'transparent';
    } else if (el.className?.includes('progress') || el.textContent?.includes('%')) {
      type = 'progress';
      text = el.textContent || 'Progress';
    } else if (el.className?.includes('qr') || el.textContent?.includes('QR')) {
      type = 'qr';
      text = 'QR Code';
      width = 120;
      height = 120;
    } else if (el.className?.includes('social') || el.textContent?.includes('Social')) {
      type = 'social';
      text = el.textContent || 'Social';
    } else if (el.tagName === 'INPUT' && el.getAttribute('type') === 'range') {
      type = 'slider';
      text = 'Slider';
      width = 150;
    } else if (el.className?.includes('toggle') || el.textContent?.includes('Toggle')) {
      type = 'toggle';
      text = 'Toggle';
      width = 60;
      height = 30;
    } else {
      text = el.textContent || 'Element';
    }
    
    // Extract only visual styles from inline styles and classes
    const styleDeclarations = inlineStyle.split(';').filter(s => s.trim());
    styleDeclarations.forEach(decl => {
      const [property, value] = decl.split(':').map(s => s.trim());
      if (property && value) {
        // Only allow visual properties
        switch (property) {
          case 'color':
            color = value;
            break;
          case 'background-color':
          case 'background':
            backgroundColor = value;
            break;
          case 'font-size':
            const sizeMatch = value.match(/(\d+)px/);
            if (sizeMatch) fontSize = parseInt(sizeMatch[1]);
            break;
          case 'font-weight':
            fontWeight = value.includes('bold') || value.includes('700') || value.includes('900') ? 'bold' : 'normal';
            break;
          case 'border-radius':
            const radiusMatch = value.match(/(\d+)px/);
            if (radiusMatch) borderRadius = parseInt(radiusMatch[1]);
            break;
          case 'border-style':
            if (['solid', 'dashed', 'dotted'].includes(value)) {
              borderStyle = value as 'solid' | 'dashed' | 'dotted';
            }
            break;
          case 'border-color':
            borderColor = value;
            break;
          case 'border-width':
            const widthMatch = value.match(/(\d+)px/);
            if (widthMatch) borderWidth = parseInt(widthMatch[1]);
            break;
          case 'opacity':
            const opacityMatch = value.match(/(\d+\.?\d*)/);
            if (opacityMatch) {
              const opacity = parseFloat(opacityMatch[1]);
              if (opacity >= 0 && opacity <= 1) {
                // Will be used in element creation
              }
            }
            break;
        }
      }
    });
    
    // Check class names for additional visual styling only
    const classNames = el.className.split(' ');
    classNames.forEach(className => {
      if (extractedStyles[className]) {
        const styles = extractedStyles[className];
        // Apply only visual styles
        Object.keys(styles).forEach(property => {
          const value = styles[property as any];
          switch (property) {
            case 'color':
              color = value;
              break;
            case 'backgroundColor':
              backgroundColor = value;
              break;
            case 'fontSize':
              const sizeMatch = value.match(/(\d+)px/);
              if (sizeMatch) fontSize = parseInt(sizeMatch[1]);
              break;
            case 'fontWeight':
              fontWeight = value.includes('bold') || value.includes('700') || value.includes('900') ? 'bold' : 'normal';
              break;
          }
        });
      }
    });
    
    // Handle visual symbols and icons only
    if (text.includes('⚡') || text.includes('✓') || text.includes('✗') || text.includes('★') || text.includes('♥')) {
      type = 'text';
      fontSize = Math.max(fontSize, 20);
    }
    
    // Create visual-only element
    const element: Element = {
      id: `imported-${Date.now()}-${index}`,
      type,
      x,
      y,
      width,
      height,
      text,
      color,
      backgroundColor,
      rotation: 0,
      opacity: 1,
      borderRadius,
      fontSize,
      fontWeight: fontWeight as 'normal' | 'bold' | '900',
      borderStyle,
      borderColor,
      borderWidth,
      zIndex: index + 1,
    };
    
    elements.push(element);
  });
  
  return elements;
}