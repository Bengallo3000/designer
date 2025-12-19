import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Element, Template } from '../types/Element';
import { 
  Plus, 
  Layers, 
  Layout, 
  Settings, 
  Undo, 
  Redo, 
  Download, 
  Upload,
  Grid,
  ZoomIn,
  Eye,
  EyeOff,
  FileText,
  Code,
  Palette
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'elements' | 'templates' | 'layers' | 'controls';
  setActiveTab: (tab: 'elements' | 'templates' | 'layers' | 'controls') => void;
  elements: Element[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  templates: Template[];
  loadTemplate: (template: Template) => void;
  handleDragStart: (type: Element['type']) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  handleExport: () => void;
  handleHTMLImport: (html: string) => void;
}

const elementTypes: Element['type'][] = [
  'button', 'input', 'text', 'image', 'timer', 
  'progress', 'qr', 'social', 'slider', 'toggle'
];

const elementIcons = {
  button: '🔘',
  input: '📝',
  text: '📄',
  image: '🖼️',
  timer: '⏱️',
  progress: '📊',
  qr: '📱',
  social: '🔗',
  slider: '🎚️',
  toggle: '🔘'
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  elements,
  selectedId,
  setSelectedId,
  templates,
  loadTemplate,
  handleDragStart,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  backgroundImage,
  setBackgroundImage,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  handleExport,
  handleHTMLImport
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHTMLFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const html = event.target?.result as string;
        handleHTMLImport(html);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-cyan-500/30 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'elements', icon: <Plus size={16} />, label: 'Elements' },
          { id: 'templates', icon: <Layout size={16} />, label: 'Templates' },
          { id: 'layers', icon: <Layers size={16} />, label: 'Layers' },
          { id: 'controls', icon: <Settings size={16} />, label: 'Controls' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs transition-colors ${
              activeTab === tab.id 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'elements' && (
          <div className="space-y-3">
            <h3 className="text-cyan-400 font-bold mb-3">Drag Elements</h3>
            {elementTypes.map(type => (
              <div
                key={type}
                draggable
                onDragStart={() => handleDragStart(type)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-move hover:border-cyan-500 hover:bg-gray-750 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{elementIcons[type]}</span>
                  <span className="text-white capitalize">{type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-3">
            <h3 className="text-cyan-400 font-bold mb-3">Templates</h3>
            
            {/* 🎨 Design-Only HTML Import Section */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={16} className="text-cyan-400" />
                <Label className="text-sm font-semibold text-cyan-400">Import Design Only</Label>
              </div>
              <Input
                type="file"
                accept=".html,.htm"
                onChange={handleHTMLFileUpload}
                className="text-xs mb-2"
              />
              <p className="text-xs text-gray-400">
                Extract visual elements only (no forms, links, or functionality)
              </p>
            </div>

            {templates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:border-cyan-500 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => loadTemplate(template)}
                  >
                    Load Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <h3 className="text-cyan-400 font-bold mb-3">Layers</h3>
            {[...elements].reverse().map(element => (
              <div
                key={element.id}
                onClick={() => setSelectedId(element.id)}
                className={`p-2 rounded cursor-pointer transition-all ${
                  selectedId === element.id 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{elementIcons[element.type]} {element.type}</span>
                  <span className="text-xs text-gray-400">
                    {Math.round(element.x)}, {Math.round(element.y)}
                  </span>
                </div>
              </div>
            ))}
            {elements.length === 0 && (
              <p className="text-gray-500 text-center py-4">No elements yet</p>
            )}
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-bold mb-3">Controls</h3>
            
            {/* Zoom */}
            <div>
              <Label className="text-xs text-gray-400">Zoom: {Math.round(zoom * 100)}%</Label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            {/* Grid Toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400">Show Grid</Label>
              <Button
                size="sm"
                variant={showGrid ? "default" : "outline"}
                onClick={() => setShowGrid(!showGrid)}
              >
                {showGrid ? <Eye size={14} /> : <EyeOff size={14} />}
              </Button>
            </div>

            {/* 🖼️ Background Image Uploader */}
            <div>
              <Label className="text-xs text-gray-400 flex items-center gap-2">
                <Upload size={12} />
                Background Image
              </Label>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs"
                />
                {backgroundImage && (
                  <div className="space-y-2">
                    <div className="text-xs text-green-400">✓ Image loaded</div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => setBackgroundImage('')}
                    >
                      Clear Background
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 🎨 Design-Only HTML Code Import */}
            <div>
              <Label className="text-xs text-gray-400 flex items-center gap-2">
                <Palette size={12} />
                Import Design HTML
              </Label>
              <textarea
                className="w-full mt-2 h-20 p-2 text-xs bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
                placeholder="Paste HTML design code here (visual elements only)..."
                onChange={(e) => {
                  if (e.target.value.includes('<') && e.target.value.includes('>')) {
                    // Auto-detect HTML and offer import
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs"
                onClick={() => {
                  const textarea = document.querySelector('textarea[placeholder*="Paste HTML design"]') as HTMLTextAreaElement;
                  if (textarea?.value) {
                    handleHTMLImport(textarea.value);
                    textarea.value = '';
                  }
                }}
              >
                Import Design Only
              </Button>
            </div>

            {/* History Controls */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                className="flex-1"
              >
                <Undo size={14} />
              </Button>
              <Button
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                className="flex-1"
              >
                <Redo size={14} />
              </Button>
            </div>

            {/* Export */}
            <Button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download size={14} className="mr-2" />
              EXPORT PRODUCTION
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};