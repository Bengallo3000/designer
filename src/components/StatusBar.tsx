import { MousePointer, Layers, Search } from 'lucide-react';

interface StatusBarProps {
  elementCount: number;
  selectedId: string | null;
  zoom: number;
  mousePosition: { x: number; y: number };
}

export const StatusBar = ({ elementCount, selectedId, zoom, mousePosition }: StatusBarProps) => {
  return (
    <div className="h-8 bg-gray-900 border-t border-cyan-500/30 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className="text-white text-xs font-medium">
            Elements: {elementCount}
          </span>
        </div>
        
        {selectedId && (
          <div className="flex items-center gap-2">
            <MousePointer className="w-3 h-3 text-green-400" />
            <span className="text-white text-xs font-medium">
              Selected: {selectedId.split('-')[1]}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3 text-cyan-400" />
          <span className="text-white text-xs font-medium">
            Mouse: {mousePosition.x}, {mousePosition.y}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-medium">
            Zoom: {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};