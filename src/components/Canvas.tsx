import React from 'react';
import { Element } from '../types/Element';

interface CanvasProps {
  elements: Element[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedId,
  setSelectedId,
  updateElement
}) => {
  const renderElement = (element: Element) => {
    const isSelected = selectedId === element.id;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      color: element.color,
      background: element.backgroundColor,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      borderRadius: element.borderRadius,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
      zIndex: element.zIndex,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: isSelected ? '2px solid #00ffff' : 'none',
      boxShadow: isSelected ? '0 0 20px rgba(0, 255, 255, 0.5)' : 'none',
      transform: `rotate(${element.rotation}deg) ${isSelected ? 'scale(1.02)' : 'scale(1)'}`,
    };

    switch (element.type) {
      case 'button':
        return (
          <button
            key={element.id}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
            className="hover:shadow-lg"
          >
            {element.text}
          </button>
        );
      case 'input':
        return (
          <input
            key={element.id}
            type="text"
            value={element.text}
            placeholder={element.text}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
            readOnly
            className="bg-transparent text-center"
          />
        );
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
          >
            {element.text}
          </div>
        );
      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
            className="bg-gray-700 border-2 border-dashed border-gray-500"
          >
            {element.text}
          </div>
        );
      case 'timer':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
            className="animate-pulse"
          >
            {element.text}
          </div>
        );
      case 'progress':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              background: `linear-gradient(90deg, #00ff00 0%, #00ff00 60%, #374151 60%, #374151 100%)`
            }}
            onClick={() => setSelectedId(element.id)}
          >
            {element.text}
          </div>
        );
      default:
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => setSelectedId(element.id)}
          >
            {element.text}
          </div>
        );
    }
  };

  return (
    <>
      {elements.map(renderElement)}
    </>
  );
};