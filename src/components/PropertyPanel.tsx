import React from 'react';
import { Element } from '../types/Element';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Slider } from './ui/Slider';
import { Trash2 } from 'lucide-react';

interface PropertyPanelProps {
  element: Element;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  element,
  updateElement,
  deleteElement
}) => {
  return (
    <div className="w-80 bg-gray-900 border-l border-cyan-500/30 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 font-bold">Properties</h3>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => deleteElement(element.id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Text */}
        <div>
          <Label className="text-xs text-gray-400">Text</Label>
          <Input
            value={element.text}
            onChange={(e) => updateElement(element.id, { text: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Color */}
        <div>
          <Label className="text-xs text-gray-400">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={element.color}
              onChange={(e) => updateElement(element.id, { color: e.target.value })}
              className="w-12 h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer"
            />
            <Input
              value={element.color}
              onChange={(e) => updateElement(element.id, { color: e.target.value })}
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <Label className="text-xs text-gray-400">Background</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={element.backgroundColor}
              onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
              className="w-12 h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer"
            />
            <Input
              value={element.backgroundColor}
              onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
            />
          </div>
        </div>

        {/* Width */}
        <div>
          <Label className="text-xs text-gray-400">Width: {element.width}px</Label>
          <Slider
            value={element.width}
            onValueChange={(value) => updateElement(element.id, { width: value })}
            min={50}
            max={400}
            className="mt-1"
          />
        </div>

        {/* Height */}
        <div>
          <Label className="text-xs text-gray-400">Height: {element.height}px</Label>
          <Slider
            value={element.height}
            onValueChange={(value) => updateElement(element.id, { height: value })}
            min={20}
            max={200}
            className="mt-1"
          />
        </div>

        {/* Rotation */}
        <div>
          <Label className="text-xs text-gray-400">Rotation: {element.rotation}°</Label>
          <Slider
            value={element.rotation}
            onValueChange={(value) => updateElement(element.id, { rotation: value })}
            min={-30}
            max={30}
            className="mt-1"
          />
        </div>

        {/* Font Size */}
        <div>
          <Label className="text-xs text-gray-400">Font Size: {element.fontSize}px</Label>
          <Slider
            value={element.fontSize}
            onValueChange={(value) => updateElement(element.id, { fontSize: value })}
            min={10}
            max={48}
            className="mt-1"
          />
        </div>

        {/* Border Radius */}
        <div>
          <Label className="text-xs text-gray-400">Border Radius: {element.borderRadius}px</Label>
          <Slider
            value={element.borderRadius}
            onValueChange={(value) => updateElement(element.id, { borderRadius: value })}
            min={0}
            max={50}
            className="mt-1"
          />
        </div>

        {/* Opacity */}
        <div>
          <Label className="text-xs text-gray-400">Opacity: {Math.round(element.opacity * 100)}%</Label>
          <Slider
            value={element.opacity}
            onValueChange={(value) => updateElement(element.id, { opacity: value })}
            min={0.1}
            max={1}
            step={0.1}
            className="mt-1"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-400">X: {Math.round(element.x)}</Label>
            <Input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Y: {Math.round(element.y)}</Label>
            <Input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};