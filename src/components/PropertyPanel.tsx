import { useState } from 'react';
import { Element } from '../types/Element';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import { Trash2, RotateCw } from 'lucide-react';

interface PropertyPanelProps {
  element: Element;
  onUpdate: (updates: Partial<Element>) => void;
  onDelete: () => void;
}

export const PropertyPanel = ({ element, onUpdate, onDelete }: PropertyPanelProps) => {
  const [localElement, setLocalElement] = useState(element);

  const handleUpdate = (key: keyof Element, value: any) => {
    const updated = { ...localElement, [key]: value };
    setLocalElement(updated);
    onUpdate({ [key]: value });
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-cyan-500/30 p-4 overflow-y-auto">
      <h3 className="text-white font-bold text-lg mb-4">Properties</h3>
      
      <div className="space-y-4">
        {/* Text Content */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">Text</Label>
          <Input
            value={localElement.text}
            onChange={(e) => handleUpdate('text', e.target.value)}
            className="mt-2 bg-gray-800 border-cyan-500/30 text-white"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white text-xs uppercase tracking-wider font-bold">Text Color</Label>
            <input
              type="color"
              value={localElement.color}
              onChange={(e) => handleUpdate('color', e.target.value)}
              className="mt-2 w-full h-10 bg-gray-800 border border-cyan-500/30 rounded cursor-pointer"
            />
          </div>
          <div>
            <Label className="text-white text-xs uppercase tracking-wider font-bold">Background</Label>
            <input
              type="color"
              value={localElement.backgroundColor === 'transparent' ? '#1a1a2e' : localElement.backgroundColor}
              onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
              className="mt-2 w-full h-10 bg-gray-800 border border-cyan-500/30 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Width: {localElement.width}px
          </Label>
          <Slider
            value={[localElement.width]}
            onValueChange={([value]) => handleUpdate('width', value)}
            max={500}
            min={50}
            step={10}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Height: {localElement.height}px
          </Label>
          <Slider
            value={[localElement.height]}
            onValueChange={([value]) => handleUpdate('height', value)}
            max={300}
            min={20}
            step={10}
            className="mt-2"
          />
        </div>

        {/* Rotation */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2">
            <RotateCw className="w-3 h-3" />
            Rotation: {localElement.rotation}°
          </Label>
          <Slider
            value={[localElement.rotation]}
            onValueChange={([value]) => handleUpdate('rotation', value)}
            max={30}
            min={-30}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Opacity */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Opacity: {Math.round(localElement.opacity * 100)}%
          </Label>
          <Slider
            value={[localElement.opacity]}
            onValueChange={([value]) => handleUpdate('opacity', value)}
            max={1}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>

        {/* Font Size */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Font Size: {localElement.fontSize}px
          </Label>
          <Slider
            value={[localElement.fontSize]}
            onValueChange={([value]) => handleUpdate('fontSize', value)}
            max={72}
            min={8}
            step={2}
            className="mt-2"
          />
        </div>

        {/* Border Radius */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Border Radius: {localElement.borderRadius}px
          </Label>
          <Slider
            value={[localElement.borderRadius]}
            onValueChange={([value]) => handleUpdate('borderRadius', value)}
            max={50}
            min={0}
            step={2}
            className="mt-2"
          />
        </div>

        {/* Border Width */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">
            Border Width: {localElement.borderWidth}px
          </Label>
          <Slider
            value={[localElement.borderWidth]}
            onValueChange={([value]) => handleUpdate('borderWidth', value)}
            max={10}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Border Style */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">Border Style</Label>
          <select
            value={localElement.borderStyle}
            onChange={(e) => handleUpdate('borderStyle', e.target.value)}
            className="mt-2 w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>

        {/* Font Weight */}
        <div>
          <Label className="text-white text-xs uppercase tracking-wider font-bold">Font Weight</Label>
          <select
            value={localElement.fontWeight}
            onChange={(e) => handleUpdate('fontWeight', e.target.value)}
            className="mt-2 w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="900">Black</option>
          </select>
        </div>

        {/* Delete Button */}
        <Button
          onClick={onDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Element
        </Button>
      </div>
    </div>
  );
};