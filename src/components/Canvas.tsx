import { useEffect, useRef } from 'react';
import { Element } from '../types/Element';

interface CanvasProps {
  elements: Element[];
  selectedId: string | null;
  zoom: number;
  showGrid: boolean;
  backgroundImage: string | null;
  isDragging: boolean;
  onElementClick: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, id: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onDrop: (e: React.DragEvent, x: number, y: number) => void;
}

export const Canvas = ({
  elements,
  selectedId,
  zoom,
  showGrid,
  backgroundImage,
  isDragging,
  onElementClick,
  onElementMouseDown,
  onMouseMove,
  onMouseUp,
  onDrop,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    onDrop(e, x, y);
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedId === element.id;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: 'move',
      userSelect: 'none',
      transition: isDragging ? 'none' : 'all 0.2s ease',
    };

    const elementStyle = {
      ...baseStyle,
      color: element.color,
      backgroundColor: element.backgroundColor,
      borderRadius: element.borderRadius,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      borderStyle: element.borderStyle,
      borderColor: element.borderColor,
      borderWidth: element.borderWidth,
      outline: isSelected ? '2px solid #00ff00' : 'none',
      boxShadow: isSelected 
        ? '0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.3)' 
        : 'none',
    };

    const content = (() => {
      switch (element.type) {
        case 'button':
          return (
            <button
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: element.backgroundColor,
                color: element.color,
                borderRadius: element.borderRadius,
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                cursor: 'pointer',
              }}
            >
              {element.text}
            </button>
          );
        case 'input':
          return (
            <input
              type="text"
              placeholder={element.text}
              style={{
                width: '100%',
                height: '100%',
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                background: element.backgroundColor,
                color: element.color,
                borderRadius: element.borderRadius,
                fontSize: element.fontSize,
                padding: '8px 12px',
              }}
              readOnly
            />
          );
        case 'image':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                borderRadius: element.borderRadius,
                background: element.backgroundColor,
              }}
            >
              <span style={{ color: element.color, fontSize: element.fontSize }}>
                {element.text}
              </span>
            </div>
          );
        case 'timer':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
              }}
            >
              {element.text}
            </div>
          );
        case 'progress':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: element.backgroundColor,
                borderRadius: element.borderRadius,
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
                  borderRadius: element.borderRadius,
                }}
              />
            </div>
          );
        case 'qr':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                borderRadius: element.borderRadius,
                background: element.backgroundColor,
                fontSize: element.fontSize,
              }}
            >
              {element.text}
            </div>
          );
        case 'social':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: element.backgroundColor,
                borderRadius: element.borderRadius,
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                fontSize: element.fontSize,
              }}
            >
              {element.text}
            </div>
          );
        case 'slider':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '4px',
                  background: element.backgroundColor,
                  borderRadius: '2px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '16px',
                    height: '16px',
                    background: element.color,
                    borderRadius: '50%',
                    border: `2px solid ${element.borderColor}`,
                  }}
                />
              </div>
            </div>
          );
        case 'toggle':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 5px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '20px',
                  background: element.backgroundColor,
                  borderRadius: '10px',
                  position: 'relative',
                  border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    background: element.color,
                    borderRadius: '50%',
                  }}
                />
              </div>
            </div>
          );
        default:
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
              }}
            >
              {element.text}
            </div>
          );
      }
    })();

    return (
      <div
        key={element.id}
        style={elementStyle}
        onClick={() => onElementClick(element.id)}
        onMouseDown={(e) => onElementMouseDown(e, element.id)}
        className="hover:brightness-110"
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-gray-950 relative overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Grid Overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          }}
        />
      )}
      
      {/* Canvas Container */}
      <div
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  );
};